# justinar-rasheed.com

A personal portfolio. Next.js 15 (App Router) and Styled-Components, exported as a static site and hosted on Vercel.

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
- **Screenshots** live in `public/work/need-to-talk/`, a light and a dark file each, and are listed on each highlight's `figure` in `content/site.ts`. A highlight without `shots` shows no picture: only the strongest images go on the page. They are fictional data from Need to Talk's own shot pipeline, or a provider's own public page with their consent; never a client, a patient, or anything behind sign-in:
  - The profile is Deborah Spence's public page (needtalk.com/to/drauntie), shot signed out.
  - Calendar and Sessions are Need to Talk's marketing shots (`apps/web/public/homepage-v2/images/`, made by `apps/web/scripts/console-shots/`).
  - The onboarding shot comes from the Need to Talk dev lab `/dev/onboarding-shots`, shot by `apps/web/scripts/onboarding-shots/shoot.js` in that repo.
- **Dribbble and résumé** stay off the page until they are set in `content/site.ts`. For the résumé, add `public/resume.pdf` and set `resume: "/resume.pdf"`.

```
app/                     routes: home, /work/need-to-talk, 404, icon, og.png (link preview)
components/views/        one file per page
components/              layout, links, figure, contact, footer
content/site.ts          every word on the site
styles/                  tokens and global styles
vendor/need-to-talk/     the booking picker's code, copied unchanged from Need to Talk (see its README)
vercel.json              security headers
```

## Deploy

The site is a Vercel project in the Need to Talk team, connected to this GitHub repo, with `justinar-rasheed.com` as its domain.

- **Every push to `main` deploys to production.** Each push is a paid build on the team's plan, so commit as often as you like and push when a batch of changes is ready. Check changes locally with `npm run dev` first.
- **A pull request gets its own preview link** before it reaches the live site.
- **The domain** is registered at Vercel and uses Vercel's DNS, so there are no records to manage. `www.justinar-rasheed.com` redirects to the bare domain.

To deploy by hand from this folder (it is linked to the project):

```bash
vercel --prod
```
