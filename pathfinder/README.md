# Pathfinder

Provide very fast paths/routes from one coordinate/node ID on the map to another using the OpenStreetMap data.

- [Run](#run)
  - [Python](#python)
  - [Docker](#docker)
- [Structure](#structure)
- [Other](#other)

## Run

### Python

```sh
# Create virtual environment
python -m venv venv_flask
# > Windows + Powershell
.\venv_flask\Scripts\activate
# > Linux
source venv_flask/bin/activate
# Install dependencies
# > Latest
python -m pip install flask flask-cors networkx osmnx scikit-learn
# > Tested
python -m pip install -r requirements.txt
# Run
# > Flask
python3 -m flask --app shortest_path_server run --host=0.0.0.0
# > File
python -m shortest_path_server
# Disable virtual environment
deactivate
```

### Docker

1. [Install Docker](https://docs.docker.com/get-docker/) and start the docker daemon
   - Linux:
     1. Install (e.g. via `sudo pacman -S docker docker-compose`)
     2. Use `systemd` to start the service: `systemctl start docker`
     3. If it's not yet working create the docker group (if it does not exist): `sudo groupadd docker`
     4. Add your user to this group: `sudo usermod -aG docker $USER`
     5. Log in to the new docker group since the current shells may not yet "know" about being added to the docker group (alternatively run `newgrp docker`)
   - Windows:
     1. Install (e.g. via `winget install -e --id Docker.DockerDesktop`)
     2. Add the binaries to the PATH: `C:\Program Files\Docker\Docker\resources\bin`
     3. Start `Docker Desktop` to start the docker engine
2. Build container declared in a `Dockerfile` in the current directory: `docker build --tag flask-docker .`
   - `docker build [OPTIONS] PATH`
   - `--tag list`: Name and optionally a tag in the "name:tag" format
3. Run container: `docker run --publish 3010:3010 flask-docker`
   - `docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`
   - `--publish list`: Publish a container's port(s) to the host

You can view:

- the created images created with `docker images`
- the currently running containers and their IDs/ports/states with `docker ps`
- stop a running container with `docker stop $ID` (stop all of them via `docker ps -aq | xargs docker stop`)
- to inspect an image use the command `docker run --rm -it --entrypoint=/bin/bash $TAG`
  (in case the image has no `bash` you may have to add it in the `Dockerfile` e.g. `RUN apk add --no-cache bash`)
- to inspect a running container use the command `docker exec -t -i $ID /bin/bash`

If you are finished you can:

- stop the docker service: `systemctl stop docker`
- prune all docker caches: `docker system prune -a`

> Make sure that all files that should not be copied to the docker container are listed in the [`.dockerignore`](.dockerignore) file!

> The `Dockerfile` was inspired by a [freecodecamp.org article 'How to Dockerize a Flask Application'](https://www.freecodecamp.org/news/how-to-dockerize-a-flask-app/).

## Structure

This app has only a few endpoints: (`None` becomes `null` in the `jsonify`'ed Python `dataclass` objects)

```py
@dataclass
class Coordinates:
    lat: float
    long: float

@dataclass
class ShortestPathResponse:
    error: str | None
    shortest_route_travel_time: list[Coordinates] | None
    shortest_route_length: list[Coordinates] | None

@app.route("/shortest_path", methods=["POST"])
# {sourceId: int, targetId: int}
@app.route("/shortest_path_coordinates", methods=["POST"])
# {source: {lat: number; long: number}, target: {lat: number; long: number}}

@dataclass
class GraphResponse:
    error: str | None
    vertices: list[Coordinates] | None
    edges: list[Coordinates] | None

@app.route("/graph", methods=["GET", "POST"])
```

You can get some example outputs by running [the example client](shortest_path_example_client.py) via `python -m shortest_path_example_client`.

## Other

There is a jupyter notebook which was used to understand the given data structures and methods with nice visualizations:

```py
# Create virtual environment
python -m venv venv_jupyter
# > Windows + Powershell
.\venv_jupyter\Scripts\activate
# > Linux
source venv_jupyter/bin/activate
# Install dependencies
# > Latest
python -m pip install flask flask-cors folium mapclassify matplotlib networkx osmnx scikit-learn
# > Tested
python -m pip install -r requirements_jupyter.txt
# Run
jupyter notebook
# > Select shortest_path_visualization.ipynb
# Disable virtual environment
deactivate
```
