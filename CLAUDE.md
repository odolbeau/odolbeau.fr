# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Source for https://odolbeau.fr — a personal site/blog built with [Cecil](https://cecil.app), a PHP static-site generator (Jekyll/Hugo-like: Markdown content + Twig templates → static HTML). There is no PHP application code to write; `cecil.phar` (vendored in the repo root) is the build tool, not a dependency of a codebase.

## Commands

```bash
make serve   # build + serve locally with live rebuild, on :8009 (CECIL_DEBUG=1 is set, exposes {{ d(page) }} debug dumps in layouts)
make deploy  # build to _site/, then rsync it to the `deploy` SSH host at /var/www/odolbeau.fr/
make install # no-op placeholder
```

Equivalent raw CLI (what the Makefile wraps): `BOX_REQUIREMENT_CHECKER=0 php cecil.phar <command>` (e.g. `build`, `serve --port=8009`). There is no test suite, linter, or CI config in this repo — nothing to run beyond the above.

`_site/`, `.cache/`, `.cecil/` are build artifacts (gitignored); never hand-edit files there.

## Content architecture

- `pages/index.md` — homepage.
- `pages/blog/YYYY-MM-DD-slug.md` — blog posts. Front matter: `title`, `date`, `published`, `lang` (`en`/`fr`), `subtitle`, `description`, `tags: [...]`.
- `pages/talks/YYYY-MM-DD-slug.md` — conference talks. Front matter adds `event`, `speakerdeck` (deck id embedded via SpeakerDeck's script), `ratio`, and optionally `joindin` (joind.in talk id) and `video` (recording URL) — each conditionally rendered in `layouts/talks/page.html.twig`.
- **Bilingual posts are two separate files** linked by a shared `reflang` value plus differing `lang` (see the `announcing-tested-routes-checker-bundle[-fr].md` pair). `layouts/blog/page.html.twig` uses `reflang`/`lang` to emit `hreflang` alternate links between them — when adding a translation, reuse the same `reflang` on both files.
- `tags` on blog posts feed Cecil's `tags` taxonomy (configured in `cecil.yml`); no custom taxonomy layout exists, so listing pages use Cecil's defaults.

## Layout architecture (Twig, in `layouts/`)

Cecil resolves a layout from the content's section path, not from any `layout:` front matter value (that key is present on some pages but effectively vestigial). The chain:

- `page.html.twig` — the actual `<html>` document: head/metatags/JSON-LD, nav, footer, and third-party CDN includes (Bootstrap CSS only — no jQuery or Bootstrap JS; the navbar collapse and other interactive bits are hand-rolled Vanilla JS in `assets/js/main.js`). Everything else extends this and overrides Twig blocks (`head`, `stylesheets`, `header`, `content`, `javascripts`, ...) rather than duplicating markup.
- `list.html.twig` — generic listing page, extends `page.html.twig`, overrides `content` to render a paginated list of `site.pages.showable` (or `page.pages`/`page.paginator.pages` when applicable).
- `blog/page.html.twig`, `blog/list.html.twig` — single post / blog index, extend the two above. The post layout adds Prism.js (loaded from jsdelivr, only here — not sitewide), an "outdated article" banner for posts over a year old, tag list, prev/next pager, and a JSON-LD `BlogPosting` block.
- `talks/page.html.twig`, `talks/list.html.twig` — single talk / talks index, extend the two above. The talk layout embeds the SpeakerDeck script embed and optional joind.in/video links.

JSON-LD structured data is layered: Cecil's built-in `metatags.data` (WebSite/ItemList, enabled in `cecil.yml`) plus hand-written `Person` (in `page.html.twig`) and `BlogPosting` (in `blog/page.html.twig`) blocks, tied together via `@id` (`{{ url(site.home, {canonical: true}) }}#person`).

## Assets vs static

- `assets/` (css/js/images) goes through Cecil's asset pipeline — referenced in Twig via `{{ asset('css/main.css') }}`, which fingerprints/hashes the output filename in `_site/`. `assets/css/prism.css` and `assets/js/prism.js` are currently unreferenced dead files (Prism is loaded from the jsdelivr CDN instead in `blog/page.html.twig`).
- `static/` (favicons, `cv.pdf`, self-hosted webfonts, talk thumbnail images) is copied to `_site/` verbatim, unprocessed — reference these with plain root-relative paths, not `asset()`.

## External resources & CSP

Third-party scripts/styles are loaded straight from CDNs rather than vendored: Bootstrap CSS (`cdn.jsdelivr.net`) in `page.html.twig`, Prism (`cdn.jsdelivr.net`) in `blog/page.html.twig`, SpeakerDeck (`speakerdeck.com`) in `talks/page.html.twig`, plus occasional inline GitHub Gist embeds (`gist.github.com` / `github.githubassets.com`) in individual post Markdown. The production server enforces a Content-Security-Policy (not part of this repo — set at the nginx/reverse-proxy level) allow-listing exactly these origins. **Adding a reference to any new external origin in a layout or post requires a matching update to that server-side CSP header**, or the resource will be blocked/reported in browsers.
