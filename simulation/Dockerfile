FROM node:21-alpine

# Uncomment next line to inspect the image/container using bash
#RUN apk add --no-cache bash

# Setting up the work directory in the top level of the file system
WORKDIR /express-docker
# Copy all non .dockerignored files into that directory
COPY . .

# Install dependencies
RUN npm install
# Build server
RUN npm run compile
RUN npm run dist
# Remove build files and dev dependencies
RUN npm install --omit=dev
RUN rm dist.ts
RUN rm .eslintignore
RUN rm .eslintrc.json
RUN rm tsconfig.json
RUN rm -rf build
RUN rm -rf src

# Expose ports to the outside
EXPOSE 3020

# Specify command to be run when starting container
CMD npm run start -- --port 3020
