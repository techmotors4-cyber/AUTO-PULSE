# GitHub Setup & GitHub Pages Deployment Plan

A step-by-step guide and automated CI/CD workflow to push the **Pollachi AutoPulse** project to GitHub and host it for free on **GitHub Pages**.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following workflow approach is confirmed based on your selections:
> - **Primary Workflow**: Clear step-by-step terminal commands to push the codebase from your machine to a new GitHub repository.
> - **Hosting Target**: Automated **GitHub Pages** deployment via official GitHub Actions workflow (`.github/workflows/deploy.yml`), ensuring each push automatically builds and updates your live site.
> - **Vite Base Path Alignment**: Configure `vite.config.ts` with relative base path (`base: './'`) so assets load without 404 errors on GitHub Pages sub-paths (`https://<username>.github.io/<repo>/`).

---

### 1. Overview & Core Concept

- **What It Does**: Provides the exact terminal command sequences to initialize Git, link to a remote GitHub repository, commit code, and push. Adds a production-ready GitHub Actions workflow file that builds the project with Vite and publishes the static web bundle directly to GitHub Pages.
- **Key Value**: One-time setup allows zero-friction code backups and 100% automated free hosting on GitHub with every code update.

---

### 2. User Experience & Step-by-Step Workflow

#### Step 1: Create a Repository on GitHub
1. Sign in to [github.com](https://github.com).
2. Click the **+** icon in the top right and select **New repository**.
3. Name your repository (e.g., `pollachi-auto-pulse`).
4. Set visibility to **Public** (required for free GitHub Pages).
5. Leave "Add a README file" and ".gitignore" **unchecked** (we already have them in our project).
6. Click **Create repository**.

#### Step 2: Push Local Code to GitHub
Run the following commands in your project root terminal:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Stage all project files
git add .

# 3. Create initial commit
git commit -m "feat: Initial commit for Pollachi AutoPulse dispatch app"

# 4. Set default branch to main
git branch -M main

# 5. Connect to your GitHub repository (replace with your actual repository URL)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/pollachi-auto-pulse.git

# 6. Push code to GitHub
git push -u origin main
```

#### Step 3: Enable Automated GitHub Pages
1. Go to your repository on GitHub.
2. Click **Settings** ➔ **Pages** (in the left sidebar).
3. Under **Build and deployment** ➔ **Source**, select **GitHub Actions**.
4. The `.github/workflows/deploy.yml` workflow will automatically run, build Vite, and publish your website!
5. Your live app URL will be: `https://<YOUR_GITHUB_USERNAME>.github.io/pollachi-auto-pulse/`.

---

### 3. Technical Configuration Deliverables

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Local Codebase Root                             │
│   • vite.config.ts  ──► (base: './' for clean GitHub Pages asset URLs) │
│   • README.md       ──► (Complete push & setup reference guide)        │
│   • .gitignore      ──► (Excludes node_modules, dist, .env)            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ git push origin main
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   GitHub Repository (main branch)                      │
│   • .github/workflows/deploy.yml                                       │
│     ├── 1. Trigger: Push to main                                       │
│     ├── 2. Setup Node.js & Install Dependencies (`npm ci`)             │
│     ├── 3. Build Production Bundle (`npm run build`)                   │
│     └── 4. Deploy `dist/` directly to GitHub Pages Environment         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Live GitHub Pages Deployment                       │
│       https://<YOUR_GITHUB_USERNAME>.github.io/pollachi-auto-pulse/    │
└────────────────────────────────────────────────────────────────────────┘
```

#### Deliverable Files
1. `.github/workflows/deploy.yml`: Automated GitHub Actions deployment pipeline for GitHub Pages.
2. `README.md`: Clear, beginner-friendly documentation with copy-paste terminal commands.
3. `vite.config.ts`: Safe relative asset path configuration (`base: './'`) to guarantee scripts and CSS load seamlessly on GitHub Pages.
