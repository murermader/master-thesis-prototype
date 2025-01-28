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

#
#
# PLOT SUS
#
# Create a bar plot with matplotlib
plt.figure(figsize=(10, 6))
plt.ylim(0, 100)
# Bar plot for SUS scores
bars = plt.bar(range(1, len(df) + 1), df["SUS Score"], color="skyblue", edgecolor="black", label="Participant SUS Scores")

average_sus_score = df["SUS Score"].mean()
plt.axhline(y=average_sus_score, color="coral", linestyle="--", label=f"Average SUS Score ({average_sus_score:.2f})")

for bar in bars:
    height = bar.get_height()
    plt.text(
        bar.get_x() + bar.get_width() / 2,
        height + 0.25,
        f'{height:.1f}',
        ha='center',
        va='bottom',
        fontsize=9,
        fontweight='bold'
    )

ax = plt.gca()
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_visible(False)
ax.spines['bottom'].set_color('gray')
ax.tick_params(bottom=False, left=False)
ax.set_axisbelow(True)
ax.yaxis.grid(True, color='#EEEEEE')
ax.xaxis.grid(False)

# Add a horizontal line for the average SUS score

# Add labels and title
plt.xlabel("Participant")
plt.ylabel("SUS Score")
plt.xticks(range(1, len(df) + 1))  # Ensure x-axis has participant numbers
plt.legend()
plt.savefig("sus.pdf", format="pdf")
# plt.show()
