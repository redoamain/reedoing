# Multi-stage Dockerfile untuk SvelteKit + SQLite (Persistent Volume)
FROM node:22-alpine AS builder

WORKDIR /app

# Salin package files
COPY package*.json ./

# Install dependensi
RUN npm ci

# Salin source code
COPY . .

# Build production bundle
RUN npm run build

# Stage Runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/app/data/app.db

# Buat folder data persisten
RUN mkdir -p /app/data

# Salin dependensi produksi dan build output
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/static ./static

# Expose port
EXPOSE 3000

# Mount point untuk volume database SQLite
VOLUME ["/app/data"]

CMD ["node", "build"]
