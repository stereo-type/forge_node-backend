ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    wget

# Create user with specified UID/GID
ARG UID=1000
ARG GID=1000
ARG USERNAME=appuser

RUN addgroup -g ${GID} ${USERNAME} && \
    adduser -D -u ${UID} -G ${USERNAME} ${USERNAME}

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files (will be overridden by volume in dev)
COPY --chown=${USERNAME}:${USERNAME} package*.json pnpm-lock.yaml* ./

# Switch to user
USER ${USERNAME}

# Install dependencies (this layer will be cached)
RUN pnpm install || true

# Expose frontend port
EXPOSE 3000

# Start development server
CMD ["pnpm", "dev"]

