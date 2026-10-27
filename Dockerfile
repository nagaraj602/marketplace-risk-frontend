# Multi-stage Dockerfile for React 19 + Vite Frontend (Node 24 LTS)
# Build Stage
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime Stage
FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production \
    PORT=8280

# Install production dependencies only for Express server
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built frontend assets and server
COPY --from=builder /app/build ./build
COPY server.js .

# Use non-root node user provided by the alpine base image
USER node

EXPOSE 8280

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:8280/health || exit 1

CMD ["node", "server.js"]
