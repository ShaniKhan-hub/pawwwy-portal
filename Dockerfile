# ─────────────────────────────────────────────────────────────────────────────
# Pawwwy portal — Dockerfile for Render deployment
#
# Multi-stage build:
#   1. Build the React frontend (Vite outputs into portal-backend/static/)
#   2. Build the Spring Boot backend JAR (now bundles the frontend)
#   3. Slim runtime image — just JRE + the JAR
#
# Render auto-detects this Dockerfile when "Docker" is selected as the language.
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1 — Builder (JDK + Maven + Node) ────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS builder

# Install Node.js 20 for the frontend build
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

# Build the React frontend.
# portal-frontend/vite.config.js outputs to ../portal-backend/src/main/resources/static
# — that path is relative to /app/portal-frontend, so the bundles land in
# /app/portal-backend's static folder, which is then packaged into the JAR.
WORKDIR /app/portal-frontend
RUN npm install --no-audit --no-fund && npm run build

# Build the Spring Boot backend (skip tests for faster builds on Render)
WORKDIR /app/portal-backend
RUN mvn -B package -DskipTests

# ── Stage 2 — Runtime (just JRE + JAR) ────────────────────────────────────────
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the fat JAR — wildcard avoids hard-coding the version
COPY --from=builder /app/portal-backend/target/pawwwy-portal-backend-*.jar app.jar

# Render sets a PORT env var (usually 10000). application.properties honors it
# via ${PORT:8090} — defaulting to 8090 locally, whatever Render provides in
# production.
EXPOSE 8090
CMD ["java", "-jar", "app.jar"]
