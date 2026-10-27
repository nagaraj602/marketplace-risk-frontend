# Marketplace Risk Trust & Safety Analyst Portal (Frontend)

Interactive Trust & Safety analyst dashboard for real-time risk triage, entity graph inspection, signal injection simulation, and manual enforcement actions.

---

## 🔗 Platform Repositories

| Repository | GitHub Link | Purpose & Tech Stack |
| :--- | :--- | :--- |
| **Platform & Infrastructure** | [nagaraj602/marketplace-risk-platform](https://github.com/nagaraj602/marketplace-risk-platform.git) | Terraform AWS IaC (VPC, EKS 1.37, RDS PostgreSQL 17, Redis 7.4, Jenkins), DB init scripts, Docker Compose |
| **Core Risk Backend** | [nagaraj602/marketplace-risk-backend](https://github.com/nagaraj602/marketplace-risk-backend.git) | Java 25 LTS, Spring Boot 4.1.2, JPA, Velocity Rule Engine, Risk Aggregation, Enforcement Orchestration |
| **ML Anomaly Model** | [nagaraj602/marketplace-risk-anomaly-model](https://github.com/nagaraj602/marketplace-risk-anomaly-model.git) | Python 3.15.2, FastAPI 0.162, scikit-learn 1.9.1 Isolation Forest, behavioral anomaly inference |
| **Trust & Safety Portal** | [nagaraj602/marketplace-risk-frontend](https://github.com/nagaraj602/marketplace-risk-frontend.git) | React 19, Vite 8, Node 24, Express 5, Lucide-React, live review queue & signal injection simulator |
| **Jenkins Shared Libraries** | [nagaraj602/jenkins-sharedlibraries](https://github.com/nagaraj602/jenkins-sharedlibraries.git) | Reusable Groovy pipeline vars (`trivyScan`, `sonarAnalysis`, `dockerECRImagePush`, `kubernetesEKSHelmDeployEnv`) |

---

## 🚀 Tech Stack
- **Framework**: React 19 + Node.js 24 LTS
- **Build Tool**: Vite 8.3 (Ultra-fast HMR and bundling in <500ms)
- **Production Server**: Express 5.0 (Static serving + API reverse proxy)
- **UI / Icons**: Lucide-React + Glassmorphism dark UI
- **Containerization**: Multi-stage Docker (`node:24-alpine` builder -> `node:24-alpine` runner)
- **Design System**: Monochromatic high-contrast palette (pure white `#ffffff` and shades of white `#f4f4f5`, `#e4e4e7`, `#d4d4d8`, `#a1a1aa` on deep obsidian canvas, zero blue/purple)
- **Orchestration**: Kubernetes + Helm v3/v4 with HPA
- **CI/CD**: Jenkins Multibranch Pipelines with SonarQube & Trivy Quality Gates

---

## ⚙️ Prerequisites

Before setting up the frontend console, verify the following prerequisites:
- **Node.js 24 LTS+**: Active LTS JavaScript runtime (`node -v`)
- **npm 10+**: Node package manager (`npm -v`)
- **Docker Engine 24.0+**: (Optional for local Vite development; required for container builds)
- **Port Availability**: Port `8280` available on localhost
- **Backend Service**: `marketplace-risk-backend` running on port `8281` (or proxy target configured via `BACKEND_URL` environment variable)

---

## 🛠️ How to Setup & Run

### Local Development
```bash
# Install dependencies
npm install

# Start Vite interactive dev server (port 8280)
npm run dev
```

### Production Build & Run with Express
```bash
npm run build
node server.js
```

### Docker Execution
```bash
docker build -t marketplace-risk-frontend:latest .
docker run -p 8280:8280 -e BACKEND_URL=http://host.docker.internal:8281 marketplace-risk-frontend:latest
```

---

## 🎮 How to Operate the Frontend Portal

1. **Access Console**: Open [http://localhost:8280](http://localhost:8280) in your browser.
2. **Real-time Telemetry**: Review top-line health metrics including queue depth, automated takedowns, false positive rate, and pipeline latency.
3. **Signal Simulator**: Click **Ingest Signal** on any scenario card (Flash Sale Burst, ATO Payout Hijack, Review Ring, or Legitimate Seller) to watch the platform score, classify, and route in real time.
4. **Entity Deep Dive**: Click the **Eye icon** on any case row to inspect the composite score breakdown (Velocity vs. ML Anomaly), anomaly flags, and connected device/IP graph linkages.
5. **Mitigation Actions**: Execute manual enforcements (**Suspend Seller**, **Takedown Listings**, **Freeze Payouts**) or resolve/dismiss cases directly from the UI.

---

## 🛡️ CI/CD & Jenkins Integration

This frontend service utilizes Jenkins Multibranch Pipelines powered by [jenkins-sharedlibraries](https://github.com/nagaraj602/jenkins-sharedlibraries.git):
- **Pull Request Quality Gate (`Jenkinsfile.pr`)**: Automatically triggered via GitHub webhook; runs Vite 8 production build and test verification, SonarQube quality gate analysis (`sonar-server`), local Docker builds, and Trivy security scans.
- **Continuous Deployment (`Jenkinsfile`)**: Triggered on branch push/merge; builds production image, pushes to Amazon ECR, updates Helm values, and deploys to AWS EKS (`dev`, `uat`, or `prod`).
- **Webhook Integration**: Configured with the **Multibranch Scan Webhook Trigger** plugin using trigger token `marketplace-risk-frontend-token`. See the [Complete Jenkins Integration Guide](https://github.com/nagaraj602/marketplace-risk-platform#%EF%B8%8F-jenkins-cicd-setup--multibranch-integration-guide).
