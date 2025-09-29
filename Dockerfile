# Use Node.js 22 LTS for xMCP compatibility
FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Expose HTTP port (if using HTTP transport)
EXPOSE 3001

# Default command (change to start:http for HTTP transport)
CMD ["npm", "run", "start:http"]
