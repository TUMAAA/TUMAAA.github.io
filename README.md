# TUMAAA.github.io

Personal site for **Anas Al-Nuaimi** — served at <https://tumaaa.github.io>.

## stack

- Plain HTML / CSS / vanilla JS — zero build step, zero framework, zero dependencies.
- Live data: GitHub REST API (repos), rss2json (Medium feed).
- Served by GitHub Pages from the `main` branch root.

## local dev

```bash
python3 -m http.server 8000
# → open http://localhost:8000
```

## structure

```
.
├── index.html   # all content + sections
├── style.css    # terminal/CRT theme
├── script.js    # boot animation + live repo/medium fetches
└── .nojekyll    # opt out of jekyll processing
```

## easter egg

Konami code on the page does *something*. Try it.