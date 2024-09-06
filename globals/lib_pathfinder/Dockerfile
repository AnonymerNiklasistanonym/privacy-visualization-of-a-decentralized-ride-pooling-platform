# << Build library in docker >>
FROM node:22.8.0-alpine AS base

# Necessary to inspect the image/container using bash
RUN apk add --no-cache bash

# Install dependencies
FROM base AS deps_lib_pathfinder
WORKDIR /globals/lib_pathfinder
COPY package.json package-lock.json ./
RUN npm ci

# Build library
FROM base AS builder_lib_pathfinder
WORKDIR /globals/lib_pathfinder
# > Copy dependencies
COPY --from=deps_lib_pathfinder /globals/lib_pathfinder/node_modules ./node_modules
# > Copy build files
COPY . .
# > Build library
RUN npm run compile
