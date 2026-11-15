# Aryan Sharma — Engineering Portfolio

A responsive, interactive personal portfolio built with **HTML, CSS, and vanilla JavaScript**. No npm install, framework, API keys, or paid hosting required.

## What's inside

- Responsive editorial-style design with light/dark theme
- Interactive service-health simulation (fictional example data, clearly marked)
- Six filterable portfolio projects with detailed modal views
- Career history, skills, selected certifications, education, and contact links
- Keyboard-accessible navigation and reduced-motion support
- Dependency-free Python smoke tests
- A GitHub Actions workflow that **tests first, then deploys to GitHub Pages**

## Open locally

The simplest option is to double-click `index.html` or open it in your browser from VS Code.

For a local HTTP preview, open the project in VS Code and run:

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000` in your browser. Stop the server with Ctrl+C.

## Run the tests

```bash
python3 -m unittest discover -s tests -v
```

These are lightweight structural/smoke tests. They do **not** validate every browser layout, monitor real services, or guarantee production readiness.

## Publish for free with GitHub Pages

1. Create an empty GitHub repository (for example, `aryan-portfolio`).
2. Open the downloaded folder in VS Code and run:
   ```bash
   git init
   git add .
   git commit -m "Create personal engineering portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/aryan-portfolio.git
   git push -u origin main
   ```
   Alternatively, if the GitHub CLI is authenticated: `gh repo create aryan-portfolio --public --source=. --remote=origin --push`.
3. In GitHub, open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
4. Open the **Actions** tab to see the `Test and deploy portfolio` workflow. A green test job allows the publish job to run.
5. After successful deployment, the site will generally be available at `https://YOUR_GITHUB_USERNAME.github.io/aryan-portfolio/`.

**Important:** If you enable Pages after your first push, run the workflow again from the Actions tab if the deployment has not completed. Publishing a public site exposes everything in the repository, so review the copy first.

## Where to edit content

- **`index.html`** — hero text, public links, experience, project summaries, qualifications
- **`script.js`** — project detail popups and interactive behavior
- **`styles.css`** — colors, typography, layout, animations
- **`assets/favicon.svg`** — browser tab icon
- **`tests/test_site.py`** — basic content and file checks
- **`.github/workflows/deploy.yml`** — GitHub Actions CI/CD pipeline

## Content and privacy notes

- Professional profile reflects information from Aryan's prior resume and mentoring discussions; **review before making public**.
- Internal Salesforce work is intentionally generalized; do not add customer names, internal dashboards, case IDs, or private architecture.
- The site does not include a work email address. Use the LinkedIn and GitHub links, or add a dedicated public personal email if desired.
- The "service-health" console is deliberately simulated and is **not** a live production monitor.
- CI/CD and AWS examples are explicitly labelled learning projects, rather than production implementation experience.
- Product/service names remain the property of their respective owners. This site is not sponsored by Salesforce.

## CI/CD architecture

```text
Push to main
    ↓
GitHub Actions starts
    ↓
Test job → Python structural checks
    ↓ on success
Deploy job → Upload static site → GitHub Pages
```

This is a real CI/CD workflow, not just a web-page mockup. Deployment requires your GitHub repository and GitHub Pages settings to be configured.
