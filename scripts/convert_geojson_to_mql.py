import json
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

for idx, d in enumerate(data["features"]):
    lat = str(d['geometry']['coordinates'][1])
    lon = str(d['geometry']['coordinates'][0])
    plac = d['properties']['PLAC']
    d_id = str(uuid.uuid4())
    item = (
        item_template.replace("<LAT>", lat)
        .replace("<LON>", lon)
        .replace("<PLAC>", plac)
        .replace("<ID>", d_id)
    )
    items.append(item)

    if idx == 100:
        break

mql = f"db.individualCoords.insertMany([{','.join(items)}])"
with open("individualCoords.mql", mode='w', encoding="utf-8") as f:
    f.write(mql)
