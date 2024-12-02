import json

geojson_file_path = ""
sql_output_file_path = "output.sql"
sql_statements = []
table_name = "landkreise"

# Load the GeoJSON file
with open(geojson_file_path) as f:
    geojson = json.load(f)

for feature in geojson['features']:
    properties = feature['properties']
    geometry = json.dumps(feature['geometry'])  # Keep as a string for PostGIS

    for property in properties:
        print(property)


    # Create the SQL INSERT statement
    sql = f"""
    INSERT INTO geojson_data (name, population, geom)
    VALUES ('{properties['name']}', {properties['population']}, ST_GeomFromGeoJSON('{geometry}'));
    """

    sql_statements.append(sql)


with open(sql_output_file_path, 'w') as out_file:
    out_file.write('\n'.join(sql_statements))

print("Done!")
