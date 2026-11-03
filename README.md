# justinar-rasheed.com

A personal portfolio. Next.js 15 (App Router) and Styled-Components, exported as a static site and hosted on AWS Amplify.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # writes the static site to out/
npm run preview    # serves out/ locally, the way Amplify will
npm run lint       # type-check
```

## Edit it

- **All copy** is in `content/site.ts`. Search it for `TODO` before you share the link.
- **Colours, type, spacing and motion** are in `styles/tokens.ts`. Light and dark follow the visitor's system setting, through CSS variables.
- **Screenshots**: put them in `public/work/need-to-talk/` and set `image` on the matching highlight in `content/site.ts`. Until then a placeholder shows. Use sample data only, never a real client, provider or patient.
- **Résumé**: replace `public/resume.pdf` (it's a placeholder now).

```
app/                     routes: home, /work/need-to-talk, 404, icon, og.png (link preview)
components/views/        one file per page
components/              layout, links, figure, contact, footer
content/site.ts          every word on the site
styles/                  tokens and global styles
amplify.yml              Amplify build settings
customHttp.yml           security and cache headers
```

## Deploy on AWS Amplify

1. Push this repo to GitHub.
2. In the AWS console, open **Amplify → Create new app → GitHub**, then pick the repo and the `main` branch.
3. Amplify picks up `amplify.yml`. Check that the build output directory is `out`, then **Save and deploy**.
4. Under **Hosting → Rewrites and redirects**, add a rule so missing pages show the 404 page:
   - Source `/<*>`, Target `/404.html`, Type `404 (Rewrite)`.

Every push to `main` now redeploys the site.

### Custom domain (DNS stays at Vercel)

`justinar-rasheed.com` is registered at Vercel and uses Vercel's nameservers, so DNS records are added there, not in Route 53.

1. In Amplify, open **Hosting → Custom domains → Add domain** and enter `justinar-rasheed.com`.
   Choose **Manual configuration** (Amplify can only configure DNS by itself on Route 53).
2. Amplify shows three records. Add each in Vercel under **Domains → justinar-rasheed.com → DNS Records**:
   - The **certificate verification CNAME**. Its name looks like `_abc123` and its value ends in `.acm-validations.aws`.
   - The **apex record**. Name blank, type **ALIAS**, value the `*.cloudfront.net` target Amplify gives you.
   - **`www`**. Name `www`, type **CNAME**, same `*.cloudfront.net` target.
3. Wait for Amplify to show the domain as **Available**. Verification usually takes minutes, and up to 48 hours.
4. Optional: in Amplify, redirect `www` to the apex (or the reverse) so there is one address.

Nothing in this setup builds on Vercel. Vercel only answers DNS for the domain.
