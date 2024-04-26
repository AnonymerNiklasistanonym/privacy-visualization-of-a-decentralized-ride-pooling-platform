FROM python:3.12-slim-bullseye

# Setting up the work directory in the top level of the file system
WORKDIR /python-docker
# Copy all non .dockerignored files into that directory
COPY . .

# Install dependencies
RUN pip3 install -r requirements.txt
# Remove build files
RUN rm -f requirements.txt

# Expose ports to the outside
EXPOSE 3010

# Specify command to be run when starting container
CMD python3 -m flask --app "shortest_path_server" run --host="0.0.0.0" --port "3010"
