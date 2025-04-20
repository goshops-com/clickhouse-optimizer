FROM node:18-alpine AS frontend-builder

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend package files and install dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source code
COPY frontend/ ./

# Build the frontend
RUN npm run build

FROM node:18-alpine AS backend

# Set working directory for backend
WORKDIR /usr/src/app

# Copy backend package files and install dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Copy built frontend to backend's public directory
COPY --from=frontend-builder /app/frontend/dist/ ./public/

# Environment variables
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3001

# Run the application
CMD ["node", "server.js"] 