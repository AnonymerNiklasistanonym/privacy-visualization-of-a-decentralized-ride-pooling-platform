from dataclasses import dataclass, asdict
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from pathlib import Path
import json
import networkx as nx
import os
import osmnx as ox

# python -m pip install flask flask-cors networkx osmnx scikit-learn
# python -m pathfinder
# python -m flask --app pathfinder run --host="0.0.0.0" --port 3010

# osmnx config
ox.settings.use_cache = True
ox.settings.log_console = True


@dataclass
class PathfinderConfigLocationBbox:
    # minLat, minLong, maxLat, maxLong
    bbox: tuple[float, float, float, float]
    type: str = "bbox"


@dataclass
class PathfinderConfigLocationCity:
    location: str
    type: str = "location"


@dataclass
class PathfinderConfig:
    locations: list[PathfinderConfigLocationBbox | PathfinderConfigLocationCity]


# app config
config = asdict(PathfinderConfig(
    locations=[
        PathfinderConfigLocationCity(location="Stuttgart, Baden-Württemberg, Germany"),
        PathfinderConfigLocationBbox(
            bbox=(48.6920188, 9.0386007, 48.8663994, 9.3160228)
        ),
    ]
))
config_file_path = Path("config.json")
if config_file_path.is_file():
    with open(config_file_path, "r") as file:
        config = json.loads(file.read())
        print("Use custom config file:", config)

# global graph
G: nx.MultiDiGraph = None


def initialize_graph(config: dict):
    """Initialize the graph."""
    global G

    print("initialize_graph", config)
    graphs: list[nx.MultiDiGraph] = []
    for location in config["locations"]:
        if location["type"] == "location" and "location" in location:
            graphs.append(
                ox.graph_from_place(location["location"], network_type="drive")
            )
        elif location["type"] == "bbox" and "bbox" in location:
            bbox = location["bbox"]
            graphs.append(
                ox.graph_from_bbox(
                    bbox=(bbox[0], bbox[2], bbox[1], bbox[3]), network_type="drive"
                )
            )
        else:
            raise RuntimeError("Found no valid location!")

    # combine all graphs
    G = nx.compose_all(graphs)

    # calculate additional weights
    G = ox.add_edge_speeds(G)
    G = ox.add_edge_travel_times(G)

    # print how many subgraphs are in that graph
    H = G.copy()
    sub_graphs = [
        H.subgraph(c).copy() for c in nx.connected_components(H.to_undirected())
    ]
    for i, sub_graph in enumerate(sub_graphs):
        print(
            f"sub graph #{i} has {len(sub_graph.nodes())} nodes "
            f"and {len(sub_graph.edges())} edges"
        )


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
        # Get all nodes and edges
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
    print(request)
    config = request.get_json(silent=True)
    initialize_graph(config)
    return "Success", 200


if __name__ == "__main__":
    app.run(
        # debug=True,
        host="0.0.0.0",
        port=3010,
    )
