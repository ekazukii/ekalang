FROM node:16-alpine AS builder

WORKDIR /app

# Copy manifests first for better layer caching
COPY ./package*.json ./

# Prevent Cypress from downloading its binary during npm install
ENV CYPRESS_INSTALL_BINARY=0

# Install all dependencies, including devDependencies (Nx plugins)
RUN npm install

# Copy the rest of the source
COPY . .

# Build the app
RUN npm run build

# Runtime image
FROM nginx:1.21.0-alpine AS production

ENV NODE_ENV=production

# Copy built assets from builder
COPY --from=builder /app/dist/apps/ide /usr/share/nginx/html

# Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
