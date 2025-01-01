import json

file_path = r"C:\Users\rb\git\master-thesis-prototype\src\assets\bern_temp.json"
with open(file_path, "r", encoding='utf-8') as file:
    data = json.load(file)

print(f"Loaded data points.")

lines = []

for d in data['features']:
    lat = d['geometry']['coordinates'][0]
    lon = d['geometry']['coordinates'][1]
    station_id = d['properties']['stationId']
    temp = d['properties']['temperature']
    relative_humidity = d['properties']['relativeHumidity']
    name = d['properties']['name']

    line = f"({station_id}, {temp}, {relative_humidity}, '{name}', ST_GeomFromText('POINT({lat} {lon})'))"
    lines.append(line)

    if len(lines) == 10:
        break

sql = f"""INSERT INTO BernTempSensors (stationId, temp, relativeHumidity, name, Location)
VALUES 
{',\n'.join(lines)};
"""
print(sql)