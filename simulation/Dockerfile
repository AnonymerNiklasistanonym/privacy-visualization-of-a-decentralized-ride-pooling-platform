FROM node:21-alpine as base

# Used for health check in 'docker compose'
RUN apk add --no-cache curl

# Uncomment next line to inspect the image/container using bash
RUN apk add --no-cache bash

# <<<< Copy external built local libraries
COPY --from=local_image_lib_globals /globals/ /globals/
COPY --from=local_image_lib_globals_fs /globals/ /globals/
COPY --from=local_image_lib_pathfinder /globals/ /globals/
# >>>>

FROM base AS deps
# Setting up the work directory in the top level of the file system
WORKDIR /app
# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Create user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 express

# Copy all non .dockerignored files into that directory
COPY . .

# Build server
RUN npm run build
# Remove build files and dev dependencies
RUN npm install --omit=dev
RUN rm dist.ts
RUN rm .eslintignore
RUN rm .eslintrc.json
RUN rm tsconfig.json
RUN rm -rf build
RUN rm -rf src

# Create log dir
RUN mkdir cache
RUN mkdir logs

# Expose necessary files to the user
RUN chown express:nodejs cache
RUN chown express:nodejs logs

# Set node environment to production
ENV NODE_ENV production

# Switch to user
USER express

# Run once to cache data
ENV ONLY_CACHE=1
RUN npm run start
ENV ONLY_CACHE=

# Expose ports to the outside
EXPOSE 3020

# Set log directory
ENV LOG_DIR "/app/logs/"

# Specify command to be run when starting container
CMD npm run start -- --port 3020 --config config.json
