from flask import Flask, request, jsonify, Response
import networkx as nx
import osmnx as ox
from dataclasses import dataclass

# run with:
# python -m venv venv_flask
# source venv_flask/bin/activate
# python -m pip install networkx osmnx flask scikit-learn
# python -m shortest_path_server

ox.settings.use_cache = True
ox.settings.log_console = True

app = Flask(__name__)

G: nx.MultiDiGraph


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
    return get_shortest_path_ids(content["sourceId"], content["targetId"])


@app.route("/shortest_path_coordinates", methods=["POST"])
def shortest_path_coordinates():
    content = request.get_json(silent=True)
    source = content["source"]
    target = content["target"]
    source_id = ox.nearest_nodes(G, source["long"], source["lat"])
    target_id = ox.nearest_nodes(G, target["long"], target["lat"])
    return get_shortest_path_ids(source_id, target_id)


def get_shortest_path_ids(source_id: int, target_id: int) -> Response:
    try:
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
    return jsonify(ShortestPathResponse(error=error, shortest_route_travel_time=shortest_route_travel_time,
                                        shortest_route_length=shortest_route_length))


def convert_node_ids_to_coordinates(node_ids: list[int]):
    return list(
        map(
            lambda node: {"lat": node["y"], "long": node["x"]},
            map(lambda node_id: G.nodes[node_id], node_ids),
        )
    )


if __name__ == "__main__":
    # create the graph
    location = ("stuttgart", "Stuttgart, Baden-Württemberg, Germany")
    G = ox.graph_from_place(location[1], network_type="drive")
    # calculate additional weights
    G = ox.add_edge_speeds(G)
    G = ox.add_edge_travel_times(G)

    app.run(
        # host="0.0.0.0",
        # debug=True,
        port=6000
    )
