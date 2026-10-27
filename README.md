# Marketplace Risk Trust & Safety Analyst Portal (Frontend)

Interactive Trust & Safety analyst dashboard for real-time risk triage, entity graph inspection, signal injection simulation, and manual enforcement actions.

---

## 🔗 Platform Repositories

| Repository | GitHub Link | Purpose & Tech Stack |
| :--- | :--- | :--- |
| **Platform & Infrastructure** | [nagaraj602/marketplace-risk-platform](https://github.com/nagaraj602/marketplace-risk-platform.git) | Terraform AWS IaC (VPC, EKS 1.32, RDS PostgreSQL 16, Redis 7, Jenkins), DB init scripts, Docker Compose |
| **Core Risk Backend** | [nagaraj602/marketplace-risk-backend](https://github.com/nagaraj602/marketplace-risk-backend.git) | Java 21, Spring Boot 4.1.2, JPA, Velocity Rule Engine, Risk Aggregation, Enforcement Orchestration |
| **ML Anomaly Model** | [nagaraj602/marketplace-risk-anomaly-model](https://github.com/nagaraj602/marketplace-risk-anomaly-model.git) | Python 3.12, FastAPI, scikit-learn Isolation Forest, behavioral anomaly inference |
| **Trust & Safety Portal** | [nagaraj602/marketplace-risk-frontend](https://github.com/nagaraj602/marketplace-risk-frontend.git) | React 19, Vite 8, Express 5, Lucide-React, live review queue & signal injection simulator |
| **Jenkins Shared Libraries** | [nagaraj602/jenkins-sharedlibraries](https://github.com/nagaraj602/jenkins-sharedlibraries.git) | Reusable Groovy pipeline vars (`trivyScan`, `sonarAnalysis`, `dockerECRImagePush`, `kubernetesEKSHelmDeployEnv`) |

---

## 🚀 Tech Stack
- **Framework**: React 19 + Node.js 22 LTS
- **Build Tool**: Vite 8.3 (Ultra-fast HMR and bundling in <500ms)
- **Production Server**: Express 5.0 (Static serving + API reverse proxy)
- **UI / Icons**: Lucide-React + Glassmorphism dark UI
- **Containerization**: Multi-stage Docker (`node:22-alpine` builder -> `node:22-alpine` runner)
- **Orchestration**: Kubernetes + Helm v3/v4 with HPA
- **CI/CD**: Jenkins Multibranch Pipelines with SonarQube & Trivy Quality Gates

---

## 🛠️ How to Setup & Run

### Local Development
```bash
# Install dependencies
npm install

# Start Vite interactive dev server (port 3000)
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
docker run -p 3000:3000 -e BACKEND_URL=http://host.docker.internal:8080 marketplace-risk-frontend:latest
```

---

## 🎮 How to Operate the Frontend Portal

1. **Access Console**: Open [http://localhost:3000](http://localhost:3000) in your browser.
2. **Real-time Telemetry**: Review top-line health metrics including queue depth, automated takedowns, false positive rate, and pipeline latency.
3. **Signal Simulator**: Click **Ingest Signal** on any scenario card (Flash Sale Burst, ATO Payout Hijack, Review Ring, or Legitimate Seller) to watch the platform score, classify, and route in real time.
4. **Entity Deep Dive**: Click the **Eye icon** on any case row to inspect the composite score breakdown (Velocity vs. ML Anomaly), anomaly flags, and connected device/IP graph linkages.
5. **Mitigation Actions**: Execute manual enforcements (**Suspend Seller**, **Takedown Listings**, **Freeze Payouts**) or resolve/dismiss cases directly from the UI.
