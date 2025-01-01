import numpy as np
import pandas as pd
import geojson
from shapely.geometry import shape


df = pd.read_csv(r"C:\Users\rb\Downloads\tripadvisor_european_restaurants.csv\tripadvisor_european_restaurants.csv", low_memory=False)
df = df[df['city'] == 'Paris']
print("Number of restaurants", len(df))

columns_to_keep = [
    "restaurant_link", "restaurant_name", "address", "latitude", "longitude",
    "top_tags", "price_range", "cuisines", "special_diets",
    "excellent", "very_good", "average", "poor", "terrible", "price_level"
]
df = df[columns_to_keep]

def convert_price_range(price):
    if pd.isna(price):
        return np.nan
    if "-" in price:
        low, high = price.split("-")
        return (len(low) + len(high)) / 2
    return len(price)

# Apply the function to the DataFrame
df['price_level'] = df['price_level'].apply(convert_price_range)

df = df.dropna()

weights = {
    "excellent": 5,
    "very_good": 4,
    "average": 3,
    "poor": 2,
    "terrible": 1
}

# Multiply each column by its weight and sum them up
df["total_ratings"] = df[["excellent", "very_good", "average", "poor", "terrible"]].sum(axis=1)
df["average_score"] = (
    df["excellent"] * weights["excellent"] +
    df["very_good"] * weights["very_good"] +
    df["average"] * weights["average"] +
    df["poor"] * weights["poor"] +
    df["terrible"] * weights["terrible"]
) / df["total_ratings"]

# df = df.sample(n=1000, random_state=42)
df = df.sort_values(by='total_ratings', ascending=False).head(1000)
print("Number of restaurants", len(df))


# Summary statistics
summary = df["average_score"].describe()
print(summary)

# Additional metrics
print("Median:", df["average_score"].median())
print("Mode:", df["average_score"].mode().tolist())
print("Skewness:", df["average_score"].skew())
print("Kurtosis:", df["average_score"].kurt())


features = []
lines = []


for _, row in df.iterrows():
    #
    # # Create a GeoJSON feature for each row
    # feature = geojson.Feature(
    #     geometry=geojson.Point((row["longitude"], row["latitude"])),
    #     properties=row.drop(["latitude", "longitude"]).to_dict()
    # )
    # features.append(feature)

    lon = row['longitude']
    lat = row['latitude']
    geojson_data = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [lon, lat]
        },
    }

    geometry = shape(geojson_data["geometry"])  # Parse the GeoJSON geometry
    wkt = geometry.wkt  # Convert to WKT

    def wrap(input: str, wrap_with : str = "'"):
        return wrap_with + str(input).replace("'", "''") + wrap_with

    values = (
        wrap(row['restaurant_link']),
        wrap(row['restaurant_name']),
        wrap(row['address']),
        f"ST_GeomFromText('{wkt}')",
        wrap(row['top_tags']),
        wrap(row['price_range']),
        wrap(row['cuisines']),
        wrap(row['special_diets']),
        int(row['excellent']),
        int(row['very_good']),
        int(row['average']),
        int(row['poor']),
        int(row['terrible']),
        int(row['price_level']),
        int(row['total_ratings'])
    )

    line = f"({', '.join([str(v) for v in values])})"
    lines.append(line)


# # Create a GeoJSON FeatureCollection
# geojson_data = geojson.FeatureCollection(features)
#
# # Save to a GeoJSON file (optional)
# with open("restaurants.geojson", "w") as f:
#     geojson.dump(geojson_data, f)

create = """
                CREATE TABLE restaurants (
                    restaurant_link VARCHAR(100) NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    address VARCHAR(100) NOT NULL,
                    Location GEOMETRY NOT NULL,
                    top_tags VARCHAR(100) NOT NULL,
                    price_range VARCHAR(100) NOT NULL,
                    cuisines VARCHAR(100) NOT NULL,
                    special_diets VARCHAR(100) NOT NULL,
                    excellent INT NOT NULL,
                    very_good INT NOT NULL,
                    average INT NOT NULL,
                    poor INT NOT NULL,
                    terrible INT NOT NULL,
                    price_level INT NOT NULL,
                    PRIMARY KEY (num));
"""

sql = f"""INSERT INTO restaurants (
    restaurant_link, name, address, location, top_tags, price_range, cuisines,
    special_diets, excellent, very_good, average, poor, terrible, price_level, total_ratings
) VALUES
{',\n'.join(lines)};
"""

print(sql)
