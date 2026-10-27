import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8280;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8281';

app.use(cors());

// Health Check for Kubernetes Probes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'marketplace-risk-frontend',
    timestamp: new Date().toISOString()
  });
});

// Proxy API requests to Spring Boot Risk Backend
app.use(
  '/api',
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true
  })
);

// Serve Static Frontend Assets
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all fallback for client-side routing in Express 5
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Marketplace Risk Frontend Server listening on port ${PORT}`);
  console.log(`🔗 Proxying /api -> ${BACKEND_URL}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
});
