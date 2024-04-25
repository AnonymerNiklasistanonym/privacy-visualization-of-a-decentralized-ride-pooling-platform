import requests


def make_request(url: str, body: dict = None):
    print(f"send request to {url=} {body=}")
    if body is None:
        res = requests.get(url, json=body)
    else:
        res = requests.post(url, json=body)
    if res.ok:
        print(res.json())
    else:
        print(res)


if __name__ == "__main__":
    base_url = "http://localhost:3010"
    make_request(
        f"{base_url}/shortest_path",
        {"sourceId": 243642, "targetId": 11690554069},
    )
    make_request(
        f"{base_url}/shortest_path",
        {"sourceId": 257080300, "targetId": 5327184817},
    )
    make_request(
        f"{base_url}/shortest_path_coordinates",
        {
            "source": {"lat": 48.8445332, "long": 9.2324381},
            "target": {"lat": 48.83962171673551, "long": 9.28015233602136},
        },
    )
    make_request(f"{base_url}/graph")
