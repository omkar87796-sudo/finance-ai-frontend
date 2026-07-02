# ── Finance AI — Frontend Dockerfile ─────────────────────────────────────────

# Stage 1: Build React app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Set the backend URL for production build
ARG REACT_APP_API_URL=http://localhost:8000
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS runtime

# Copy built React files
COPY --from=builder /app/build /usr/share/nginx/html

# Nginx config: serve React SPA, proxy /api to backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
