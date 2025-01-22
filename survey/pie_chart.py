import matplotlib.pyplot as plt
import matplotlib.cm as cm

# Data for the pie chart
labels = ['Computer Science', 'Other']
sizes = [7, 3]

# cmap = cm.get_cmap('bone', len(sizes))
# colors = [cmap(i) for i in range(len(sizes))]

fig, ax = plt.subplots(figsize=(4, 4))  # Small size suitable for floating in text
ax.pie(
    sizes,
    labels=labels,
    autopct=lambda p: f'{int(round(p * sum(sizes) / 100))}',  # Display raw numbers inside
    # colors=colors,
    startangle=90
)
ax.axis('equal')  # Equal aspect ratio ensures the pie chart is circular

# Export the pie chart to a PDF file
pdf_path = "participants_pie.pdf"
plt.savefig(pdf_path, format='pdf', bbox_inches='tight')
