import pandas as pd

df = pd.read_csv("data.csv")

sus_columns = [
    "I think that I would like to use this system frequently. ",
    "I found the system unnecessarily complex. ",
    "I thought the system was easy to use. ",
    "I think that I would need the support of a technical person to be able to use this system. ",
    "I found the various functions in this system were well integrated. ",
    "I thought there was too much inconsistency in this system. ",
    "I would imagine that most people would learn to use this system very quickly. ",
    "I found the system very cumbersome to use. ", "I felt very confident using the system. ",
    "I needed to learn a lot of things before I could get going with this system. "
]
assert len(sus_columns) == 10

def calculate_sus_score(row):
    odd_indices = [0, 2, 4, 6, 8]
    even_indices = [1, 3, 5, 7, 9]
    # Subtract 1 from odd-question scores
    odd_score = sum(row[odd_indices] - 1)
    # Subtract even-question scores from 5
    even_score = sum(5 - row[even_indices])
    return (odd_score + even_score) * 2.5
df_sus = df[sus_columns]
df_sus["SUS Score"] = df_sus.apply(calculate_sus_score, axis=1)
average_sus_score = df_sus["SUS Score"].mean()
median_sus_score = df_sus["SUS Score"].median()
std_dev_sus_score = df_sus["SUS Score"].std()
print(f"Average SUS Score: {average_sus_score:.2f}")
print(f"Median SUS Score: {median_sus_score:.2f}")
print(f"Standard Deviation of SUS Scores: {std_dev_sus_score:.2f}")
