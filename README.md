# AI Agent Dock

**AI Agent Dock** is a static, SEO-friendly directory of copy-ready AI coding assets — rules, roles, skills, hooks, workflows, and MCP configs — for [Cursor](https://cursor.com), [Windsurf](https://codeium.com/windsurf), Claude Code, GitHub Copilot, Codex, and MCP-compatible tools. Browse, search, filter, and copy assets for popular stacks like Next.js, Python, Supabase, Tailwind, FastAPI, Docker, and more.

Live site: [https://ai-agentdock.com/](https://ai-agentdock.com/)

## Project structure

| File | Purpose |
|------|---------|
| `index.html` | Homepage — search, filters, asset grid, SEO content |
| `rules.js` | Base rule data (`window.RULES_DATA` array) |
| `extra-assets.js` | Roles, skills, hooks, workflows, MCP configs, and tool-specific assets |
| `app.js` | Renders assets, handles search/filter/copy |
| `styles.css` | Custom styles (dark theme) |
| `about.html` | About page |
| `privacy.html` | Privacy policy |
| `submit.html` | Asset submission form |
| `sitemap.xml` | Sitemap for search engines |
| `robots.txt` | Crawler directives |
| `site-config.js` | Site URL and GitHub link |
| `package.json` | `npm run build` → `node scripts/build.js` |
| `rules/` | Generated static rule detail pages (run build script) |

## How to add a new asset

1. Open `rules.js` for rules, or `extra-assets.js` for roles, skills, hooks, workflows, and MCP configs.
2. Add a new object using the existing format:

```javascript
{
  id: 'unique-slug',
  title: 'Asset Title',
  tool: 'Cursor',           // Cursor, Windsurf, Claude Code, GitHub Copilot, Codex, MCP
  assetType: 'Rules',       // Rules, Roles, Skills, Hooks, Workflows, MCP Configs
  category: 'Frontend',
  framework: 'Next.js',
  description: 'One-line summary.',
  tags: ['Next.js', 'React'],
  content: `# Asset Title\n\nMarkdown or prompt content here...`
}
```

3. Run `node scripts/build.js` to regenerate detail pages, SEO directory, and sitemap.
4. Test locally (see below) — the new asset should appear in the grid immediately.

## Build script

After editing `rules.js` or `extra-assets.js`:

```bash
node scripts/build.js
```

This creates/updates:
- `rules/{id}.html` — one static detail page per asset
- SEO directory in `index.html` (between `SEO-DIRECTORY` markers)
- `sitemap.xml` with all asset URLs
- `dist/` — deployable copy of the site (when the build completes)

### Windows build troubleshooting

On Windows, if the build fails with an **EPERM**, **EBUSY**, or **ENOTEMPTY** error while deleting `dist/`, close any running dev server, file explorer window, preview process, or antivirus scan that may be locking files in `dist/`, then run the build again. The build script retries folder deletion automatically, but a locked file handle can still block cleanup.

## Local development

Serve the project root with any static file server:

```bash
npx serve .
# or
python -m http.server 8080
```

Open `http://localhost:8080` and verify rule cards render, search/filter work, and the copy button succeeds.

## Deploy to Cloudflare

### Option A — Cloudflare Pages (recommended)

1. Push this repository to GitHub.
2. In the [Cloudflare dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the repository and configure:
   - **Build command:** `npm run build`
   - **Build output directory:** `/` (project root)
   - **Deploy command:** leave **empty**
4. Each push to `main` runs the build and Cloudflare Pages publishes the site automatically.
5. Add your custom domain (`ai-agentdock.com`) under **Custom domains**.

### Option B — Workers Builds (recommended for `wrangler deploy`)

This repo builds a `dist/` folder and uploads **only that directory** (about 50 small HTML/JS/CSS files, well under Cloudflare's 25 MiB per-file limit). Do **not** point assets at the repo root — that uploads `node_modules/workerd` (~121 MiB) and fails.

| File | Purpose |
|------|---------|
| `wrangler.jsonc` | Worker name, `build.command`, `assets.directory` = `./dist` |
| `scripts/build.js` | Generates rule pages and copies the site into `dist/` |
| `scripts/verify-dist.js` | Fails deploy early if `dist/` is missing or any file exceeds 24 MiB |
| `.assetsignore` | Safety net to skip `node_modules/` if assets dir is ever misconfigured |

**Cloudflare dashboard → Worker → Settings → Builds:**

| Setting | Value |
|---------|-------|
| **Production branch** | `main` |
| **Root directory** | leave **empty** (repo root — not `dist/`) |
| **Build command** | leave empty |
| **Build caching** | **disabled** (until first successful deploy) |
| **Deploy command** | `npx wrangler deploy --config wrangler.jsonc` |

Wrangler runs `build.command` from `wrangler.jsonc` before upload, so the deploy command does not need `deploy.js` or npm scripts. Use `npx wrangler` so `bun install` printing `No packages!` is fine.

**If files are "not found" but production branch is `main`:** open the build in Cloudflare and check the **Git commit SHA**. Retrying an old failed build re-runs an **old commit** (before `deploy.js` / `scripts/` fixes). Instead, push a new commit or use **Create deployment** on the latest `main` commit — do not use **Retry deployment** on an old run.

`bun install` may print `No packages!` — that is OK when using `npx wrangler deploy`.

## SEO checklist

- Canonical URLs and Open Graph tags point to `https://ai-agentdock.com/`
- `sitemap.xml` lists all public pages and clean rule URLs (`/rules/{id}`)
- Cloudflare Workers `html_handling` serves `/rules/{id}` from `rules/{id}.html` (no `_redirects` needed)
- `robots.txt` allows crawling and references the sitemap
- FAQ section + FAQPage schema on the homepage
- ItemList schema generated by the build script

## Analytics & Search Console

Edit `site-config.js` and fill in the IDs you receive from each service:

```javascript
plausibleDomain: 'ai-agentdock.com',        // Plausible dashboard → Site settings
ga4MeasurementId: 'G-XXXXXXXXXX',           // GA4 → Admin → Data streams
googleSiteVerification: 'your-token-here'   // Search Console → HTML tag method
```

Then run `node scripts/build.js` and deploy. Analytics load via `analytics.js` on every page.

**Google Search Console setup:**
1. Go to [Search Console](https://search.google.com/search-console)
2. Add property `https://ai-agentdock.com`
3. Choose **HTML tag** verification → copy the `content` value into `googleSiteVerification`
4. Rebuild and deploy, then click **Verify** in Search Console
5. Submit sitemap: `https://ai-agentdock.com/sitemap.xml`

Use **either** Plausible **or** GA4, or both. Update `privacy.html` if you enable tracking.
