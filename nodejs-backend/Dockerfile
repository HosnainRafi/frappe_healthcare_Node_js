FROM node:18-alpine

WORKDIR /app

# Install dependencies for native modules and OpenSSL for Prisma
RUN apk add --no-cache python3 make g++ openssl openssl-dev

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and rebuild native modules
RUN npm install --omit=dev && npm rebuild bcrypt --build-from-source

# Copy application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Create uploads directory
RUN mkdir -p uploads logs

# Expose port
EXPOSE 3000

# Health check script
COPY healthcheck.js .

# Start application
CMD ["npm", "start"]
