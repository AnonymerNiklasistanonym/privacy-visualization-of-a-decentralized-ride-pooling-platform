import requests


def make_request(url: str, body: dict = None, json_response=True):
    print(f"send request to {url=} {body=}")
    if body is None:
        res = requests.get(url, json=body)
    else:
        res = requests.post(url, json=body)
    print(res)
    if res.ok:
        if json_response:
            # truncate long lists
            result = res.json()
            if isinstance(result, dict):
                for key, value in result.items():
                    if isinstance(value, list) and len(value) > 5:
                        result[key] = result[key][:4] + ["..."]
            if isinstance(result, list) and len(value) > 10:
                result = result[:9] + ["..."]
            print(result)
        else:
            print(res.text)


if __name__ == "__main__":
    base_url = "http://localhost:3010"
    make_request(f"{base_url}/running", json_response=False)
    make_request(
        f"{base_url}/update_config",
        body={
            "locations": [
                {
                    "type": "location",
                    "location": "Stuttgart, Baden-Württemberg, Germany",
                },
            ],
        },
        json_response=False,
    )
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
        body={
            "source": {"lat": 48.8445332, "long": 9.2324381},
            "target": {"lat": 48.83962171673551, "long": 9.28015233602136},
        },
    )
    make_request(f"{base_url}/graph")
