import json
import re
import uuid

file_path = r"C:\Users\rb\switchdrive\OFBScientificDatabase\Database\places_2500_flipped.geojson"
with open(file_path, "r") as file:
    data = json.load(file)

print(f"Loaded data points.")

item_template = """
{
    "geometry": {
        "type": "Point",
        "coordinates": [
            <LAT>,
            <LON>
        ]
    },
    "place": "<PLAC>",
    "id": "<ID>",
}"""

items = []
allowed_characters = re.compile(r'[^a-zA-Zäöüß\-. ]')

for idx, d in enumerate(data["features"]):
    lat = d['geometry']['coordinates'][0]
    lon = d['geometry']['coordinates'][1]
    plac = allowed_characters.sub('', d['properties']['PLAC'])
    d_id = str(uuid.uuid4())

    # Create the object directly
    item = {
        "geometry": {
            "type": "Point",
            "coordinates": [lat, lon]
        },
        "place": plac,
        "id": d_id,
    }
    # Add the serialized JSON string to the items list
    items.append(json.dumps(item))

    # if idx == 75:
    #     break

mql = f"db.individualCoords.insertMany([{','.join(items)}])"
with open("individualCoords.mql", mode='w', encoding="utf-8") as f:
    f.write(mql)
