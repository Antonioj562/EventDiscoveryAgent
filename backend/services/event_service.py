import json

def get_events():
    with open("data/sample_events.json") as f:
        return json.load(f)