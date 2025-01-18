import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("data_prof_sus.csv")
df = df.drop(columns=['What is your role? '])
print(df.head())

correlation = df.corr()['SUS Score']
correlation = correlation.drop('SUS Score')
correlation = correlation.sort_values(ascending=False)
print(correlation)
# The strongest positive correlation is with GIS experience (0.356), while years of programming experience (-0.144) has a slight negative correlation.
