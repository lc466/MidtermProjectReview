# Museum — The Evolution of Computing (Prototype Site)

This folder contains a lightweight static site scaffold for GitHub Pages with the following pages:

- Home (`index.html`)
- Timeline (`timeline.html`)
- Missions (`missions.html`)
- Artifacts (`artifacts.html`)
- Gallery (`gallery.html`)
- Visit (`visit.html`)

The site follows the project's SPEC.md for structure and placeholders. Interactive modules are currently represented as workspace placeholders and should be integrated from the project source.

## Quick publish (GitHub Pages)

1. Create a new repository on GitHub and push this project (root contains `site/`).
2. In the repository settings → Pages, set the publishing source to the `main` branch and the `/site` folder (or `gh-pages` branch root if you prefer).
3. Optionally add a `.nojekyll` file to the `site/` directory to avoid Jekyll processing.

Example commands (from project root):

```bash
git init
git add .
git commit -m "Initial site scaffold"
# create repo on github, then:
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

## Next steps

- Integrate interactive modules into `index.html` Active Workspace area or as separate JS modules.
- Replace placeholder images in `site/assets/img` with production assets and add provenance metadata.
- Add accessibility attributes and ARIA patterns for custom components.
- Wire analytics events following `SPEC.md` instrumentation guidance.
