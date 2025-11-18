FROM node:16-alpine AS builder

# Add a work directory
WORKDIR /app

# Cache and install dependencies
COPY ./package*.json ./

# Prevent Cypress from downloading its binary during npm install
ENV NODE_ENV=production
ENV CYPRESS_INSTALL_BINARY=0

RUN npm install

# Copy app files
COPY . .

# Build the app
RUN npm run build

# Bundle static assets with nginx
FROM nginx:1.21.0-alpine AS production

ENV NODE_ENV=production

# Copy built assets from builder
COPY --from=builder /app/dist/apps/ide /usr/share/nginx/html

# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
