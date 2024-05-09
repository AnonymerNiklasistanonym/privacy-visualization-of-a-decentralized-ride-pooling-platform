from dataclasses import dataclass
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from pathlib import Path
import json
import networkx as nx
import os
import osmnx as ox

# python -m pip install flask flask-cors networkx osmnx scikit-learn
# python -m shortest_path_server
# python -m flask --app shortest_path_server run --host="0.0.0.0" --port 3010

# osmnx config
ox.settings.use_cache = True
ox.settings.log_console = True

# app config
config = {
    "type": "location",
    "location": "Stuttgart, Baden-Württemberg, Germany",
    #"type": "bbox",
    #"bbox": [48.6920188, 9.0386007, 48.8663994, 9.3160228],
}
config_file_path = Path("config.json")
if config_file_path.is_file():
    with open(config_file_path,"r") as file:
        config = json.loads(file.read())
        print("Use custom config file:", config)

# global graph
G: nx.MultiDiGraph = None


def initialize_graph(config: dict):
    global G
    if config["type"] == "location":
        # > from a location (e.g. city)
        #location = "Stuttgart, Baden-Württemberg, Germany"
        G = ox.graph_from_place(config["location"], network_type="drive")
    elif config["type"] == "bbox":
        # > from a location (e.g. city)
        #bbox = (48.6920188, 9.0386007, 48.8663994, 9.3160228)
        bbox = config["bbox"]
        G = ox.graph_from_bbox(bbox=(bbox[0], bbox[2], bbox[1], bbox[3]), network_type="drive")
    else:
        raise RuntimeError("Found no valid configuration!")

    # calculate additional weights
    G = ox.add_edge_speeds(G)
    G = ox.add_edge_travel_times(G)


def init_app():
    """Initialize the core application."""
    # create the flask app
    app = Flask(__name__)
    cors = CORS(app, resources={r"/*": {"origins": "*"}})

    # initialize the graph
    initialize_graph(config)

    # early exit to only cache the web request
    if "ONLY_CACHE" in os.environ and os.environ["ONLY_CACHE"] == "1":
        exit(0)

    with app.app_context():
        return app


app = init_app()


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
def shortest_path():
    content = request.get_json(silent=True)
    return jsonify(get_shortest_path_ids(content["sourceId"], content["targetId"]))


@app.route("/shortest_path_coordinates", methods=["POST"])
def shortest_path_coordinates():
    content = request.get_json(silent=True)
    source, target = content["source"], content["target"]
    source_coordinates = {"lat": source["lat"], "long": source["long"]}
    target_coordinates = {"lat": target["lat"], "long": target["long"]}
    source_id = ox.nearest_nodes(
        G, source_coordinates["long"], source_coordinates["lat"]
    )
    target_id = ox.nearest_nodes(
        G, target_coordinates["long"], target_coordinates["lat"]
    )
    return jsonify(
        get_shortest_path_ids(
            source_id, target_id, source_coordinates, target_coordinates
        )
    )


@dataclass
class GraphResponse:
    error: str | None
    vertices: list[Coordinates] | None
    edges: list[Coordinates] | None


@app.route("/graph", methods=["GET", "POST"])
def graph():
    return jsonify(get_graph())


def get_graph() -> GraphResponse:
    try:
        # Get the shortest paths
        gdf_nodes, gdf_edges = ox.graph_to_gdfs(G, nodes=True, edges=True)
        vertices = list(
            map(
                lambda x: dict({"lat": x[1]["y"], "long": x[1]["x"], "id": x[0]}),
                gdf_nodes.iterrows(),
            )
        )
        edges = list(
            map(
                lambda x: list(
                    map(
                        lambda y: {"lat": y[1], "long": y[0]},
                        x[1]["geometry"].coords,
                    )
                ),
                gdf_edges.iterrows(),
            )
        )
        error = None
    except nx.NetworkXNoPath as e:
        vertices = None
        edges = None
        error = str(e)
    return GraphResponse(
        error=error,
        edges=edges,
        vertices=vertices,
    )


def convert_node_ids_to_coordinates(node_ids: list[int]):
    return list(
        map(
            lambda node: {"lat": node["y"], "long": node["x"]},
            map(lambda node_id: G.nodes[node_id], node_ids),
        )
    )


def get_shortest_path_ids(
    source_id: int, target_id: int, source_coordinates=None, target_coordinates=None
) -> ShortestPathResponse:
    try:
        # Get the shortest paths
        shortest_route_travel_time = convert_node_ids_to_coordinates(
            nx.shortest_path(
                G, source=source_id, target=target_id, weight="travel_time"
            )
        )
        shortest_route_length = convert_node_ids_to_coordinates(
            nx.shortest_path(G, source=source_id, target=target_id, weight="length")
        )
        error = None
    except nx.NetworkXNoPath as e:
        shortest_route_travel_time = None
        shortest_route_length = None
        error = str(e)
    # Add the actual coordinates to the path if not None
    if source_coordinates is not None:
        if shortest_route_travel_time is not None:
            shortest_route_travel_time = [
                source_coordinates
            ] + shortest_route_travel_time
        if shortest_route_length is not None:
            shortest_route_length = [source_coordinates] + shortest_route_length
    if target_coordinates is not None:
        if shortest_route_travel_time is not None:
            shortest_route_travel_time = shortest_route_travel_time + [
                target_coordinates
            ]
        if shortest_route_length is not None:
            shortest_route_length = shortest_route_length + [target_coordinates]
    return ShortestPathResponse(
        error=error,
        shortest_route_travel_time=shortest_route_travel_time,
        shortest_route_length=shortest_route_length,
    )


@app.route("/running", methods=["GET"])
def running():
    return "Success", 200


@app.route("/update_config", methods=["POST"])
def update_config():
    config = request.get_json(silent=True)
    initialize_graph(config)
    return "Success", 200


if __name__ == "__main__":
    # Only used when running via 'python -m shortest_path_server'
    app.run(
        # debug=True,
        host="0.0.0.0",
        port=3010,
    )
