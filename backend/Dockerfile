FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# Copy package.json and package-lock.json first for better caching
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Create public directory if it doesn't exist
RUN mkdir -p public

# Environment variables
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3001

# Run the application
CMD ["node", "server.js"] 