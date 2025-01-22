import pandas as pd
import matplotlib.pyplot as plt


def calculate_sus_score(row):
    odd_indices = [0, 2, 4, 6, 8]
    even_indices = [1, 3, 5, 7, 9]
    # Subtract 1 from odd-question scores
    odd_score = sum(row[odd_indices] - 1)
    # Subtract even-question scores from 5
    even_score = sum(5 - row[even_indices])
    return (odd_score + even_score) * 2.5


df = pd.read_csv("data.csv")

#
#
# CALCULATE SUS SCORE
#

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

df_sus = df[sus_columns]
df["SUS Score"] = df_sus.apply(calculate_sus_score, axis=1)
df.to_csv("data_with_sus.csv", index=False)

prof_and_sus = [
    'What is your current level of education? ',
    'What is your role? ',
    'Which department do you belong to?',
    'How many years of experience do you have with programming? ',
    'How experienced are you in working with databases? ',
    'Which of the following query languages have you worked with? ',
    'How experienced are you in working with Geographic Information Systems (GIS)? ',
    "SUS Score",
]
df_prof = df[prof_and_sus]
df_prof.to_csv("data_prof_sus.csv", index=False)

years = df['How many years of experience do you have with programming? '].mean()
gis = df["How experienced are you in working with Geographic Information Systems (GIS)? "].mean()
db = df['How experienced are you in working with databases? '].mean()

average_sus_score = df["SUS Score"].mean()
median_sus_score = df["SUS Score"].median()
std_dev_sus_score = df["SUS Score"].std()
min_sus_score = df["SUS Score"].min()
print(f"Average SUS Score: {average_sus_score:.2f}")
print(f"Median SUS Score: {median_sus_score:.2f}")
print(f"Standard Deviation of SUS Scores: {std_dev_sus_score:.2f}")
print(f"Min: {min_sus_score:.2f}")

#
#
# PLOT SUS
#
# Create a bar plot with matplotlib
plt.figure(figsize=(10, 6))
# Bar plot for SUS scores
plt.bar(range(1, len(df) + 1), df["SUS Score"], color="skyblue", edgecolor="black", label="Participant SUS Scores")
# Add a horizontal line for the average SUS score
average_sus_score = df["SUS Score"].mean()
plt.axhline(y=average_sus_score, color="red", linestyle="--", label=f"Average SUS Score ({average_sus_score:.2f})")
# Add labels and title
plt.xlabel("Participant")
plt.ylabel("SUS Score")
plt.xticks(range(1, len(df) + 1))  # Ensure x-axis has participant numbers
plt.legend()
# Show the plot
# plt.tight_layout()
# plt.show()
plt.savefig("sus.pdf", format="pdf")

#
#
# Task Confidence
#
