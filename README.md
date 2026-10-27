# Marketplace Risk Trust & Safety Analyst Portal (Frontend)

Interactive Trust & Safety dashboard for real-time risk triage, entity graph inspection, signal injection simulation, and manual enforcement actions.

## 🚀 Tech Stack
- **Framework**: React 19 + Node.js 22 LTS
- **Server**: Express 5 (Static serving + API reverse proxy)
- **UI / Icons**: Lucide-React + Glassmorphism dark UI
- **Containerization**: Multi-stage Docker (`node:22-alpine` builder -> `node:22-alpine` runner)
- **Orchestration**: Kubernetes + Helm v3/v4 with HPA
- **CI/CD**: Jenkins Multibranch Pipelines with SonarQube & Trivy Quality Gates

## 📋 Features
- **Live Telemetry Banner**: Pending cases, automated takedowns, false positive rate, pipeline latency
- **Prioritized Case Queue**: SLA countdown, risk tier badges (Critical, High, Elevated, Low)
- **Entity Deep-Dive Inspector**: Composite score breakdown (Velocity 45% + ML Anomaly 55%), graph linkages
- **One-Click Enforcements**: Suspend seller, takedown listings, freeze payouts
- **Interactive Signal Simulator**: Trigger real-time Kafka signal bursts and observe platform response

## 🧪 Local Run
```bash
npm install --legacy-peer-deps
npm run build
node server.js
```

## 🐳 Docker Multi-Stage Build
```bash
docker build -t marketplace-risk-frontend:latest .
docker run -p 3000:3000 marketplace-risk-frontend:latest
```
