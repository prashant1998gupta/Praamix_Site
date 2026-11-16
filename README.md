# praamix.com

One Vercel project hosting two static portfolios as sub-paths:

| Path | What | Source of truth |
| --- | --- | --- |
| `/` | Landing page (`index.html`) | this repo |
| `/prashant/` | Prashant Gupta's portfolio | `D:\Prashant_Workspace\WebProjects\Prashant_Portfolio` (copied in) |
| `/aman/` | Aman Yadav's portfolio | `D:\Prashant_Workspace\WebProjects\Aman_Portfolio` (copied in) |

`vercel.json` turns on clean URLs (`/aman/cv`, `/prashant/neon`), trailing slashes (so relative asset paths resolve inside each folder), asset caching and security headers. The two portfolios are plain static sites; nothing needs a build step.

## Updating a portfolio

Each portfolio still lives in its own repo. After changing one, copy it over and push:

```bash
# from D:\Prashant_Workspace\WebProjects
rsync -a --delete --exclude .git --exclude .claude --exclude vercel.json --exclude robots.txt --exclude sitemap.xml --exclude .nojekyll Aman_Portfolio/ Praamix_Site/aman/
```

(On Windows without rsync: delete `Praamix_Site/aman`, copy `Aman_Portfolio` in, remove its `vercel.json`, `robots.txt`, `sitemap.xml`, `.nojekyll`.) Then fix the canonical / `og:url` lines to `https://praamix.com/aman/…` (the copies in this repo already point there) and push.

## Deploy

1. Push this repo to GitHub.
2. Vercel → Add New Project → import the repo. Framework preset: **Other**. No build command, output directory `.` (root). Deploy.
3. Project → Settings → Domains → add `praamix.com` (and `www.praamix.com`). Vercel shows the DNS records; normally:
   ```
   A      @     76.76.21.21
   CNAME  www   cname.vercel-dns.com
   ```
4. Add those at the domain registrar. HTTPS is issued automatically once DNS resolves.

Every push to the default branch redeploys.
