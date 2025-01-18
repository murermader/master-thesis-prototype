import matplotlib.pyplot as plt
import pandas as pd

df = pd.read_csv("data.csv")

# Rename columns for easier handling
df = df.rename(columns={
    "How confident are you in completing Task 1 using the Prototype?": "Task 1 (With)",
    "How confident are you in completing Task 1 without using the Prototype?": "Task 1 (Without)",
    "How confident are you in completing Task 2 using the Prototype?": "Task 2 (With)",
    "How confident are you in completing Task 2 without using the Prototype?": "Task 2 (Without)",
    "How confident are you in completing Task 3 using the Prototype?": "Task 3 (With)",
    "How confident are you in completing Task 3 without using the Prototype?": "Task 3 (Without)"
})

# Calculate averages
averages = df[["Task 1 (With)", "Task 1 (Without)",
               "Task 2 (With)", "Task 2 (Without)",
               "Task 3 (With)", "Task 3 (Without)"]].mean()

# Separate data for plotting
tasks = ["Task 1", "Task 2", "Task 3"]
with_tool = [averages[f"{task} (With)"] for task in tasks]
without_tool = [averages[f"{task} (Without)"] for task in tasks]

overall_with_tool = sum(with_tool) / len(with_tool)
overall_without_tool = sum(without_tool) / len(without_tool)

# Plot line charts for each task
plt.figure(figsize=(10, 6))
plt.plot(tasks, with_tool, marker='o', label=f'With Prototype (Avg: {overall_with_tool:.2f})')
plt.plot(tasks, without_tool, marker='o', label=f'Without Prototype (Avg: {overall_without_tool:.2f})')
# plt.plot(tasks, with_tool, marker='o', label='With Prototype')
# plt.plot(tasks, without_tool, marker='o', label='Without Prototype')
# plt.title('Average Confidence Levels Across Tasks')
# plt.xlabel('Tasks')
plt.ylabel('Average Confidence Level')
plt.ylim(0, 5)
plt.legend()
plt.grid(True)
plt.savefig("task_confidence.pdf", format="pdf")
