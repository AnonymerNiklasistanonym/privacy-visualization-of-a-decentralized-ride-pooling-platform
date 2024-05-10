FROM python:3.12-slim-bullseye

# Used for health check in 'docker compose'
RUN apt-get update && apt-get install -y curl

# Setting up the work directory in the top level of the file system
WORKDIR /python-docker
# Copy all non .dockerignored files into that directory
COPY . .

# Install dependencies
RUN pip3 install -r requirements.txt
# Remove build files
RUN rm -f requirements.txt

# Run once to cache data
ENV ONLY_CACHE=1
RUN python3 -m pathfinder
ENV ONLY_CACHE=

# Expose ports to the outside
EXPOSE 3010

# Specify command to be run when starting container
CMD python3 -m flask --app pathfinder run --host="0.0.0.0" --port 3010
