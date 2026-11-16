/* ============================================================
   NETPLAY — 1v1 real-time link for the arcade
   WebRTC DataChannel (P2P) with Firebase Firestore signaling.

   Architecture:
     host  = authoritative simulation (ball, scoring)
     guest = sends paddle input, renders host state with
             interpolation + local prediction of its own paddle
   Signaling docs live in netplay/{room} and are short-lived;
   they only ever hold SDP/ICE handshake data.
   ============================================================ */
(function () {
    'use strict';

    var CFG = {
        apiKey: "AIzaSyCzak1i6SymM7TVUMUEfeAPCuZRkbCa-iI",
        authDomain: "signin-288c1.firebaseapp.com",
        projectId: "signin-288c1",
        storageBucket: "signin-288c1.firebasestorage.app",
        messagingSenderId: "4035861745",
        appId: "1:4035861745:web:313402e3d1c95a8c645d50"
    };
    var ICE = {
        iceServers: [
            { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }
        ]
    };
    var CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 confusion

    var fb = null, loading = null;

    function load() {
        if (fb) return Promise.resolve(fb);
        if (loading) return loading;
        loading = Promise.all([
            import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
            import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
        ]).then(function (m) {
            var app;
            try { app = m[0].getApp('netplay'); } catch (e) { app = m[0].initializeApp(CFG, 'netplay'); }
            fb = { fs: m[1], db: m[1].getFirestore(app) };
            return fb;
        }).catch(function (err) { loading = null; throw err; });
        return loading;
    }

    function code(n) {
        var s = '';
        for (var i = 0; i < (n || 4); i++) s += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
        return s;
    }

    /* ---------- Net session ----------
       events: onOpen(role), onData(msg), onClose(reason), onStatus(text) */
    function Session(handlers) {
        this.h = handlers || {};
        this.pc = null;
        this.dc = null;
        this.room = null;
        this.role = null;
        this.closed = false;
        this.unsub = [];
        this.timer = null;
    }

    Session.prototype._status = function (t) { if (this.h.onStatus) this.h.onStatus(t); };

    Session.prototype._wire = function (dc) {
        var self = this;
        this.dc = dc;
        dc.onopen = function () {
            self._clearTimeout();
            if (self.h.onOpen) self.h.onOpen(self.role);
        };
        dc.onmessage = function (e) {
            if (self.h.onData) {
                try { self.h.onData(JSON.parse(e.data)); } catch (err) {}
            }
        };
        dc.onclose = function () { self.close('peer left'); };
        dc.onerror = function () { self.close('connection error'); };
    };

    Session.prototype._peer = function () {
        var self = this;
        var pc = new RTCPeerConnection(ICE);
        pc.onconnectionstatechange = function () {
            if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
                self.close('connection lost');
            }
        };
        this.pc = pc;
        return pc;
    };

    Session.prototype._clearTimeout = function () {
        if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    };
    Session.prototype._timeout = function (ms, reason) {
        var self = this;
        this._clearTimeout();
        this.timer = setTimeout(function () {
            if (!self.dc || self.dc.readyState !== 'open') self.close(reason);
        }, ms);
    };

    /* host: create room, wait for a guest */
    Session.prototype.host = function (fixedRoom) {
        var self = this;
        this.role = 'host';
        this._status('connecting…');
        return load().then(function (f) {
            var F = f.fs;
            var room = fixedRoom || code(4);
            self.room = room;
            var ref = F.doc(F.collection(f.db, 'netplay'), room);
            var pc = self._peer();
            self._wire(pc.createDataChannel('game', { ordered: false, maxRetransmits: 0 }));

            var hostIce = F.collection(ref, 'hostIce');
            var guestIce = F.collection(ref, 'guestIce');
            pc.onicecandidate = function (e) {
                if (e.candidate) F.addDoc(hostIce, e.candidate.toJSON()).catch(function () {});
            };

            return pc.createOffer().then(function (offer) {
                return pc.setLocalDescription(offer).then(function () {
                    return F.setDoc(ref, {
                        offer: { type: offer.type, sdp: offer.sdp },
                        game: 'pong',
                        createdAt: F.serverTimestamp()
                    });
                });
            }).then(function () {
                self._status('waiting for player 2…');
                self._timeout(120000, 'nobody joined');
                self.unsub.push(F.onSnapshot(ref, function (snap) {
                    var d = snap.data();
                    if (d && d.answer && pc.signalingState !== 'stable') {
                        pc.setRemoteDescription(new RTCSessionDescription(d.answer)).catch(function () {});
                    }
                }));
                self.unsub.push(F.onSnapshot(guestIce, function (snap) {
                    snap.docChanges().forEach(function (ch) {
                        if (ch.type === 'added') {
                            pc.addIceCandidate(new RTCIceCandidate(ch.doc.data())).catch(function () {});
                        }
                    });
                }));
                return room;
            });
        });
    };

    /* guest: join an existing room */
    Session.prototype.join = function (room) {
        var self = this;
        this.role = 'guest';
        this.room = room;
        this._status('connecting…');
        return load().then(function (f) {
            var F = f.fs;
            var ref = F.doc(F.collection(f.db, 'netplay'), room);
            return F.getDoc(ref).then(function (snap) {
                if (!snap.exists() || !snap.data().offer) throw new Error('room not found');
                var pc = self._peer();
                pc.ondatachannel = function (e) { self._wire(e.channel); };
                var hostIce = F.collection(ref, 'hostIce');
                var guestIce = F.collection(ref, 'guestIce');
                pc.onicecandidate = function (e) {
                    if (e.candidate) F.addDoc(guestIce, e.candidate.toJSON()).catch(function () {});
                };
                return pc.setRemoteDescription(new RTCSessionDescription(snap.data().offer))
                    .then(function () { return pc.createAnswer(); })
                    .then(function (answer) {
                        return pc.setLocalDescription(answer).then(function () {
                            return F.updateDoc(ref, { answer: { type: answer.type, sdp: answer.sdp } });
                        });
                    })
                    .then(function () {
                        self._timeout(20000, 'could not connect');
                        self.unsub.push(F.onSnapshot(hostIce, function (s2) {
                            s2.docChanges().forEach(function (ch) {
                                if (ch.type === 'added') {
                                    pc.addIceCandidate(new RTCIceCandidate(ch.doc.data())).catch(function () {});
                                }
                            });
                        }));
                        return room;
                    });
            });
        });
    };

    Session.prototype.send = function (obj) {
        if (this.dc && this.dc.readyState === 'open') {
            try { this.dc.send(JSON.stringify(obj)); } catch (e) {}
        }
    };

    Session.prototype.close = function (reason) {
        if (this.closed) return;
        this.closed = true;
        this._clearTimeout();
        this.unsub.forEach(function (u) { try { u(); } catch (e) {} });
        this.unsub.length = 0;
        try { if (this.dc) this.dc.close(); } catch (e) {}
        try { if (this.pc) this.pc.close(); } catch (e) {}
        if (this.h.onClose) this.h.onClose(reason || 'closed');
    };

    window.NETPLAY = {
        available: typeof RTCPeerConnection !== 'undefined',
        create: function (handlers) { return new Session(handlers); },
        linkFor: function (room) {
            return location.origin + location.pathname + '?vs=' + room + '#play';
        },
        roomFromUrl: function () {
            var m = /[?&]vs=([A-Z0-9]{4})/i.exec(location.search);
            return m ? m[1].toUpperCase() : null;
        }
    };
})();
