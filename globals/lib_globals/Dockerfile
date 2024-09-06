# << Build library in docker >>
FROM node:22.8.0-alpine AS base

# Necessary to inspect the image/container using bash
RUN apk add --no-cache bash

# Install dependencies
FROM base AS deps_lib_globals
WORKDIR /globals/lib_globals
COPY package.json package-lock.json ./
RUN npm ci

# Build library
FROM base AS builder_lib_globals
WORKDIR /globals/lib_globals
# > Copy dependencies
COPY --from=deps_lib_globals /globals/lib_globals/node_modules ./node_modules
# > Copy build files
COPY . .
# > Build library
RUN npm run compile
