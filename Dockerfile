# Multi-stage build for CyberGuardian AI

# Stage 1: Build the client
FROM node:20-alpine AS client-builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Production image
FROM nginx:alpine AS production

# Copy built client files
COPY --from=client-builder /app/client/dist /usr/share/nginx/html

# Copy nginx configuration
COPY infra/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
