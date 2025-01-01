import pandas as pd
import geopandas as gpd
from shapely.geometry import Point, Polygon

# Load the parquet file into a DataFrame
file_path = r"C:\Users\rb\switchdrive\OFBScientificDatabase\Database\places.parquet"  # Replace with actual file path
df = pd.read_parquet(file_path)

# Filter the DataFrame for valid latitude and longitude, and no error
filtered_df = df.loc[
    (df['pelias_lat'].notnull()) &
    (df['pelias_lon'].notnull()) &
    (df['pelias_error'].isnull())
]

# Define the polygon (coordinates provided in the problem)
polygon_coords = [
    (-13.362185511041936, 40.045513363411494),
    (24.255001988958067, 36.74001024557866),
    (44.29406448895808, 53.17396150341101),
    (34.53820511395807, 65.98284198954418),
    (-6.243044886041935, 67.20457680449049),
    (-14.328982386041936, 61.93961146869499),
    (-15.559451136041936, 46.25681845881884),
    (-13.362185511041936, 40.045513363411494)  # Close the polygon
]
polygon = Polygon(polygon_coords)

# Convert filtered DataFrame to GeoDataFrame
filtered_gdf = gpd.GeoDataFrame(
    filtered_df,
    geometry=[Point(xy) for xy in zip(filtered_df['pelias_lon'], filtered_df['pelias_lat'])],
    crs="EPSG:4326"
)

# Filter data points within the polygon
polygon_gdf = filtered_gdf[filtered_gdf.within(polygon)]

# Select 500 random rows
sampled_gdf = polygon_gdf.sample(n=2000, random_state=42)

# Flip coordinates for 10 random rows
indices_to_flip = sampled_gdf.sample(n=80, random_state=42).index
sampled_gdf.loc[indices_to_flip, ['pelias_lat', 'pelias_lon']] = sampled_gdf.loc[indices_to_flip, ['pelias_lon', 'pelias_lat']].values

# Update the geometry column to reflect the flipped coordinates
sampled_gdf['geometry'] = [Point(xy) for xy in zip(sampled_gdf['pelias_lon'], sampled_gdf['pelias_lat'])]

# Select required columns for GeoJSON
geojson_gdf = sampled_gdf[['PLAC', 'PLAC.TYPE', 'pelias_lat', 'pelias_lon', 'pelias_match_type', 'geometry']]

# Save to GeoJSON file
output_path = r"C:\Users\rb\switchdrive\OFBScientificDatabase\Database\places_2500_flipped.geojson"
geojson_gdf.to_file(output_path, driver='GeoJSON')
print("Done!")
