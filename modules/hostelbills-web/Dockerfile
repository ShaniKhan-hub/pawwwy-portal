# ─────────────────────────────────────────────────────────────────────────────
# HostelBills web port — Dockerfile for Render deployment
#
# Multi-stage build:
#   1. Build the React frontend (Vite outputs into the backend's static folder)
#   2. Build the Spring Boot backend JAR (which now bundles the frontend)
#   3. Slim runtime image — just the JRE + the JAR
#
# Render auto-detects this Dockerfile when you choose "Docker" as the language.
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
# vite.config.js outputs to ../backend/src/main/resources/static — that path
# is relative to /app/frontend, so the bundles land in /app/backend's static
# folder, which is then packaged into the JAR.
WORKDIR /app/frontend
RUN npm install --no-audit --no-fund && npm run build

# Build the Spring Boot backend (skip tests for faster builds on Render)
WORKDIR /app/backend
RUN mvn -B package -DskipTests

# ── Stage 2 — Runtime (just the JRE + the JAR) ────────────────────────────────
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the fat JAR from the builder stage. The wildcard avoids hard-coding
# the version (matches hostelbills-web-backend-1.0.0.jar etc.).
COPY --from=builder /app/backend/target/hostelbills-web-backend-*.jar app.jar

# Render sets a PORT env var (usually 10000). application.properties honors it
# via ${PORT:8091} — defaulting to 8091 locally, whatever Render provides in
# production.
EXPOSE 8091
CMD ["java", "-jar", "app.jar"]
