import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("data_prof_sus.csv")
df = df.drop(columns=['What is your role? '])

for method in {'pearson', 'kendall', 'spearman'}:
    correlation = df.corr(method=method)['SUS Score']
    correlation = correlation.drop('SUS Score')
    correlation = correlation.sort_values(ascending=False)
    print(method)
    print(correlation)
