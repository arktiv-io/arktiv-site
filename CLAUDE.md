# CLAUDE.md — Arktiv Site

## 1. PROJECT OVERVIEW

**arktiv.io** is the marketing website for Arktiv, an AI skills management SaaS product targeting performance marketing teams. The site's job is to explain the product, capture beta waitlist signups, and publish SEO-optimized content.

- **Stack:** Static HTML/CSS/JS — no build step, no framework, no bundler
- **Hosting:** Netlify, deployed directly from the `main` branch
- **Domain:** https://arktiv.io (canonical); arktiv.netlify.app redirects to it via `netlify.toml`
- **Analytics:** Google Analytics 4 (`G-D9FJMCFXXF`)
- **Forms:** Netlify Forms (`name="lead-capture"`) for beta waitlist signups
- **Fonts:** Inter via Google Fonts
- **Theme color:** `#5b5ef4`

---

## 2. FILE STRUCTURE

```
arktiv-site/
├── index.html                    ← Homepage (hero, features, pricing, CTAs)
├── 404.html                      ← Custom 404 error page
├── robots.txt                    ← Crawler rules
├── sitemap.xml                   ← XML sitemap (update on every page add/change)
├── manifest.json                 ← PWA web app manifest
├── netlify.toml                  ← Netlify config: security headers, CSP, redirects
│
├── assets/
│   ├── favicon.svg               ← SVG favicon
│   ├── css/
│   │   └── shared.css            ← Global stylesheet — used on every page
│   └── js/
│       ├── nav.js                ← Mobile nav toggle (toggleNav, scroll shadow, smooth scroll)
│       └── modal.js              ← Waitlist modal (openModal function)
│
├── blog/
│   ├── index.html                ← Blog listing page
│   ├── controlling-ai-within-your-company/index.html
│   ├── how-to-scale-ai-for-enterprise-marketing/index.html
│   ├── marketers-using-ai-to-scale-quickly/index.html
│   ├── the-ai-marketing-loop/index.html
│   └── why-github-doesnt-work-for-marketers/index.html
│
└── privacy/
    └── index.html                ← Privacy Policy
```

Blog posts live at `blog/<slug>/index.html` so URLs are clean (no `.html` extension).
All pages share `/assets/css/shared.css` and load `/assets/js/modal.js` and `/assets/js/nav.js` at the bottom of `<body>`.

### Known asset gaps (fix before launch)

The following files are referenced in every page's `<head>` but do not exist in the repo yet. Social media previews are currently broken, and some browsers will show a missing favicon.

- `assets/og-image.png` — referenced by every `og:image` and `twitter:image` tag
- `assets/favicon-32.png` — referenced by `<link rel="icon" sizes="32x32">`
- `assets/apple-touch-icon.png` — referenced by `<link rel="apple-touch-icon">`

Do not remove the `<link>` and `<meta>` tags for these — just create the missing files.

---

## 3. SEO REQUIREMENTS

These rules apply to **every page** on every change. Run through this checklist before committing.

### Required on every page

- [ ] Unique `<title>` tag. Format for blog posts: `Post Title — Arktiv`. Format for the homepage: `Arktiv — Tagline`.
- [ ] `<meta name="description">` — unique, under 160 characters, keyword-rich.
- [ ] `<meta name="robots" content="index, follow" />`
- [ ] `<link rel="canonical" href="https://arktiv.io/[path]/" />` — trailing slash, full absolute URL.
- [ ] Open Graph tags: `og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:site_name`.
  - `og:image` should be `https://arktiv.io/assets/og-image.png` unless the post has a unique image.
  - Blog posts also need `article:published_time` and `article:author`.
- [ ] Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description` (and `twitter:image` if og:image is set).
- [ ] JSON-LD structured data appropriate to page type (see below).
- [ ] Exactly **one `<h1>`** per page. It must be the first heading in the DOM.
- [ ] All `<img>` tags must have descriptive `alt` text (not empty, not "image").

### JSON-LD by page type

| Page type     | Schema `@type`                            |
|---------------|-------------------------------------------|
| Homepage      | `Organization` + `SoftwareApplication`   |
| Blog index    | `Blog`                                    |
| Blog post     | `Article` + optionally `FAQPage` if the post has an FAQ section |
| Privacy/legal | `WebPage`                                 |

Use the existing pages as the canonical reference for exact JSON-LD structure.

### Internal linking (blog posts)

Every blog post must contain **at least 2 internal links** to other pages on arktiv.io — either within the article body or in the Related Posts section. The Related Posts section at the bottom of each post already satisfies this; don't remove it.

---

## 4. BLOG POST TEMPLATE

New blog posts must follow this exact HTML structure. Do not invent variations.

**File location:** `blog/<slug>/index.html`
**URL:** `https://arktiv.io/blog/<slug>/`

### Nav pattern

`nav.js` targets elements by ID (`getElementById('navLinks')`, `getElementById('hamburger')`) and `querySelector('nav')`. Class names on the button are CSS-only. The canonical pattern — used on all blog pages — is:

```html
<nav aria-label="Main navigation">
  ...
  <button class="hamburger" id="hamburger" ...>
```

Note: the homepage currently uses `<nav id="mainNav">` and `class="nav-hamburger"` — this is an inconsistency to clean up at some point, but both work with nav.js.

### Full template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Primary SEO -->
  <title>POST TITLE — Arktiv</title>
  <meta name="description" content="Under 160 chars. Unique to this post." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://arktiv.io/blog/SLUG/" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://arktiv.io/blog/SLUG/" />
  <meta property="og:title" content="POST TITLE — Arktiv" />
  <meta property="og:description" content="Same as meta description or a short variant." />
  <meta property="og:image" content="https://arktiv.io/assets/og-image.png" />
  <meta property="og:site_name" content="Arktiv" />
  <meta property="article:published_time" content="YYYY-MM-DD" />
  <meta property="article:author" content="Arktiv Team" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="POST TITLE" />
  <meta name="twitter:description" content="Short summary." />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#5b5ef4" />

  <!-- JSON-LD: Article -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "POST TITLE",
    "description": "Same as meta description.",
    "url": "https://arktiv.io/blog/SLUG/",
    "datePublished": "YYYY-MM-DD",
    "dateModified": "YYYY-MM-DD",
    "author": { "@type": "Organization", "name": "Arktiv", "url": "https://arktiv.io" },
    "publisher": {
      "@type": "Organization",
      "name": "Arktiv",
      "url": "https://arktiv.io",
      "logo": { "@type": "ImageObject", "url": "https://arktiv.io/assets/favicon.svg" }
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://arktiv.io/blog/SLUG/" }
  }
  </script>

  <!-- GA4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-D9FJMCFXXF"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-D9FJMCFXXF');</script>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap" rel="stylesheet" />

  <!-- Shared styles -->
  <link rel="stylesheet" href="/assets/css/shared.css" />

  <style>
    /* Page-specific styles — copy from an existing blog post as starting point */
  </style>
</head>
<body>

<a href="#main" class="skip-nav">Skip to main content</a>

<!-- MODAL: must be present in static HTML on every page for Netlify Forms detection.
     Netlify scans HTML at deploy time — if the form is only injected via JS, it won't be detected. -->
<div id="leadModal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modalHeading">
  <div class="modal-card">
    <button class="modal-close" aria-label="Close modal">&times;</button>
    <div id="modalFormWrap">
      <h2 id="modalHeading">Get early access to Arktiv</h2>
      <p class="modal-sub">Join 340+ performance marketers on the waitlist.</p>
      <form id="leadForm" data-netlify="true" name="lead-capture" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="lead-capture" />
        <p style="display:none"><label>Don't fill this: <input name="bot-field" /></label></p>
        <div class="form-group">
          <label for="lead-name">Full name</label>
          <input type="text" id="lead-name" name="name" placeholder="Jane Smith" required autocomplete="name" />
        </div>
        <div class="form-group">
          <label for="lead-email">Work email</label>
          <input type="email" id="lead-email" name="email" placeholder="jane@company.com" required autocomplete="email" />
        </div>
        <div class="form-group">
          <label for="lead-company">Company name</label>
          <input type="text" id="lead-company" name="company" placeholder="Acme Inc." required autocomplete="organization" />
        </div>
        <button type="submit" class="modal-submit" id="modalSubmitBtn">Get early access →</button>
        <p id="modalError" class="modal-error" role="alert" style="display:none">Something went wrong. Please try again or email us directly.</p>
      </form>
      <p class="modal-disclaimer">No spam. No credit card. We'll reach out personally.</p>
    </div>
    <div class="modal-success" id="modalSuccess" aria-live="polite">
      <div class="modal-success-icon" aria-hidden="true">🎉</div>
      <h3 tabindex="-1">You're on the list!</h3>
      <p>We'll be in touch personally when your beta spot is ready.</p>
    </div>
  </div>
</div>

<!-- NAV -->
<nav aria-label="Main navigation">
  <a href="/" class="nav-logo" aria-label="Arktiv home">
    <div class="nav-logo-mark" aria-hidden="true">
      <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1.5" fill="white"/><rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity=".6"/><rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity=".6"/><rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity=".3"/></svg>
    </div>
    <span class="nav-logo-text">Ark<span>tiv</span></span>
  </a>
  <button class="hamburger" id="hamburger" aria-label="Toggle navigation" aria-expanded="false" aria-controls="navLinks" onclick="toggleNav()">
    <span></span><span></span><span></span>
  </button>
  <ul class="nav-links" id="navLinks">
    <li><a href="/#features">Features</a></li>
    <li><a href="/#pricing">Pricing</a></li>
    <li><a href="/blog/">Blog</a></li>
    <li><button class="nav-cta" onclick="openModal('nav')">Get early access</button></li>
  </ul>
</nav>

<!-- ARTICLE HERO -->
<header class="article-hero">
  <div class="article-hero-inner">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a> <span aria-hidden="true">›</span>
      <a href="/blog/">Blog</a> <span aria-hidden="true">›</span>
      <span>SHORT POST TITLE</span>
    </nav>
    <span class="post-tag">CATEGORY</span>
    <h1>FULL POST TITLE</h1>
    <p class="lede">One or two sentence intro. This is the lede — no heading above it.</p>
    <div class="article-meta">
      <span class="article-meta-item"><span aria-hidden="true">📅</span> MONTH YYYY</span>
      <span class="article-meta-item"><span aria-hidden="true">✍️</span> Arktiv Team</span>
      <span class="article-meta-item"><span aria-hidden="true">⏱️</span> X min read</span>
    </div>
  </div>
</header>

<!-- ARTICLE BODY -->
<main id="main">
  <div class="article-body">
    <article class="article-content">
      <!-- Body content: <p>, <h2>, <h3>, <ul>, <ol>, <table class="comparison-table">, <div class="callout"> -->
      <!-- At least 2 internal links to other arktiv.io pages within this content or the related posts section below -->
    </article>

    <!-- SIDEBAR -->
    <aside class="article-sidebar" aria-label="Article sidebar">
      <div class="sidebar-card">
        <h3>Sidebar CTA headline</h3>
        <p>Short pitch copy.</p>
        <button class="sidebar-btn" onclick="openModal('source')">Get early access →</button>
      </div>
    </aside>
  </div>
</main>

<!-- RELATED POSTS: required on every blog post — satisfies the 2 internal link minimum -->
<section class="related-posts" aria-label="Related articles">
  <div class="related-inner">
    <h2 style="font-size:24px;font-weight:800;letter-spacing:-.5px;margin-bottom:4px;">Keep reading</h2>
    <p style="font-size:15px;color:var(--slate-500);">More on AI skills and marketing intelligence</p>
    <div class="related-grid">
      <a href="/blog/SLUG-1/" class="related-card">
        <span class="post-tag">CATEGORY</span>
        <h3>Post title</h3>
        <p>One sentence description.</p>
      </a>
      <a href="/blog/SLUG-2/" class="related-card">
        <span class="post-tag">CATEGORY</span>
        <h3>Post title</h3>
        <p>One sentence description.</p>
      </a>
      <a href="/blog/SLUG-3/" class="related-card">
        <span class="post-tag">CATEGORY</span>
        <h3>Post title</h3>
        <p>One sentence description.</p>
      </a>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <a href="/" class="footer-logo" aria-label="Arktiv home">
      <div class="footer-logo-mark" aria-hidden="true">
        <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
          <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white"/>
          <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity=".6"/>
          <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity=".6"/>
          <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity=".3"/>
        </svg>
      </div>
      <span class="footer-logo-text">Arktiv</span>
    </a>
    <ul class="footer-links">
      <li><a href="/#features">Features</a></li>
      <li><a href="/#pricing">Pricing</a></li>
      <li><a href="/blog/">Blog</a></li>
      <li><a href="/privacy/">Privacy</a></li>
      <li><a href="#" onclick="openModal('footer');return false;">Contact</a></li>
    </ul>
    <span class="footer-copy">© 2026 Arktiv, Inc. All rights reserved.</span>
  </div>
</footer>

<script src="/assets/js/modal.js"></script>
<script src="/assets/js/nav.js"></script>
</body>
</html>
```

---

## 5. SITEMAP RULES

**File:** `sitemap.xml`

When any page is added or an existing page is modified:

1. Add or update the `<url>` entry for that page.
2. Set `<lastmod>` to today's date in `YYYY-MM-DD` format.
3. Use these priorities:
   - Homepage: `1.0`, `changefreq: weekly`
   - Blog index: `0.9`, `changefreq: weekly`
   - Blog posts: `0.8`, `changefreq: monthly`
   - Privacy/legal: `0.3`, `changefreq: yearly`
4. All `<loc>` URLs must include the trailing slash and use `https://arktiv.io`.

---

## 6. PUBLISHING RULES

- **Never push to `main` without explicit approval.** Always confirm before running any `git push`.
- **Always show the full diff** (`git diff`) before staging or committing anything.
- **Run the SEO checklist** (Section 3) before every commit. Call out anything that doesn't pass.
- **Update `dateModified`** in the JSON-LD `Article` schema whenever an existing blog post is edited — not just when it's first created.
- **Update `sitemap.xml`** with today's date as `<lastmod>` for any page that was added or changed (Section 5).
- **Commit messages must be descriptive.** Not "update" or "fix." Examples:
  - `Add blog post: How to Scale AI for Enterprise Marketing`
  - `Fix canonical tag on privacy page`
  - `Update sitemap with May 2026 lastmod dates`
- **One logical change per commit.** Don't bundle a new blog post with homepage copy changes.
- The site deploys automatically on push to `main`. There is no staging environment — treat `main` as production.
