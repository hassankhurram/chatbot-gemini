# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine

# Install build dependencies for native modules
RUN apk add --no-cache libc6-compat python3 make g++ git \
    krb5-dev \
    cyrus-sasl-dev \
    openssl-dev \
    pkgconfig

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Expose port
EXPOSE $PORT

# Set port for Cloud Run
ENV PORT=$PORT
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["npm", "start"]