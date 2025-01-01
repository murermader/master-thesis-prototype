import json
from shapely.geometry import shape

file_path = r"C:\Users\rb\Downloads\arrondissements.geojson"
with open(file_path, "r", encoding='utf-8') as file:
    data = json.load(file)

print(f"Loaded data points.")

commands = []
lines = []

for d in data['features']:
    coordinates = d['geometry']['coordinates']

    geojson_data = {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": coordinates
        },
        "properties": {"name": "Example Polygon"}
    }

    geometry = shape(geojson_data["geometry"])  # Parse the GeoJSON geometry
    wkt = geometry.wkt  # Convert to WKT

    num = d['properties']['c_ar']
    name = d['properties']['l_aroff']

    line = f"({num}, '{name}', ST_GeomFromText('{wkt})'))"
    lines.append(line)

    # cypher_command = f"""
    # CREATE (n:Arrondissement {{
    #   polygon: {{
    #     type: 'Polygon',
    #     coordinates: {str(coordinates)}
    #   }},
    #   num: {num},
    #   name: '{name}'
    # }})"""
    #
    # commands.append(cypher_command)

create = """
                CREATE TABLE arrondissement (
                    num INT NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    Location GEOMETRY NOT NULL,
                    PRIMARY KEY (num));
"""

sql = f"""INSERT INTO arrondissement (num, name, Location)
VALUES
{',\n'.join(lines)};
"""
print(sql)
