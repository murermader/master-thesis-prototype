import json
from shapely.geometry import shape

file_path = r"C:\Users\rb\git\master-thesis-prototype\src\assets\sightseeing.geojson"
with open(file_path, "r", encoding='utf-8') as file:
    data = json.load(file)

print(f"Loaded data points.")

commands = []
lines = []

for idx, d in enumerate(data['features']):
    coordinates = d['geometry']['coordinates']

    geojson_data = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": coordinates
        },
    }

    geometry = shape(geojson_data["geometry"])  # Parse the GeoJSON geometry
    wkt = geometry.wkt  # Convert to WKT

    name = d['properties']['name'].replace("'", "''")

    line = f"({idx}, '{name}', ST_GeomFromText('{wkt})'))"
    lines.append(line)

create = """
                CREATE TABLE sightseeing (
                    idx INT NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    Location GEOMETRY NOT NULL,
                    PRIMARY KEY (idx));
"""

sql = f"""INSERT INTO sightseeing (idx, name, Location)
VALUES
{',\n'.join(lines)};
"""
print(sql)
