import pandas as pd
from scipy.stats import pearsonr, spearmanr, kendalltau

# Load the dataset
df = pd.read_csv("data_prof_sus.csv")
df = df.drop(columns=['What is your role? '])

# Initialize methods and corresponding functions
methods = {
    'pearson': pearsonr,
    'spearman': spearmanr,
    'kendall': kendalltau
}

# Iterate over each method
for method, func in methods.items():
    print(f"\n{method.capitalize()} Correlation:")
    correlations = []

    # Compute correlation and p-value for each column (excluding SUS Score itself)
    for col in df.columns:
        if col != 'SUS Score':
            corr, p_value = func(df[col], df['SUS Score'])
            correlations.append((col, corr, p_value))

    # Sort results by correlation value
    correlations = sorted(correlations, key=lambda x: abs(x[1]), reverse=True)

    # Print the results
    for col, corr, p_value in correlations:
        print(f"{col}: Correlation = {corr:.3f}, P-value = {p_value:.4f}")
