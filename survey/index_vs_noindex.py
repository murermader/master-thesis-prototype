import matplotlib.pyplot as plt

from matplotlib import rc

# Use Computer Modern font
# rc('font', family='serif', serif=['Computer Modern'])
# rc('text', usetex=True)

# Data
steps = ['1000', '10 000', '25 000', '50 000', '100 000']
default_times = [57.147675, 487.473431, 1312.20273995, 2653.53503814, 5056.052291]
mongo_times = [8.592755, 18.985399, 35.70343193, 68.01575299999999, 125.72021602000001]

# Bar width
bar_width = 0.35

# Bar positions
positions_default = range(len(steps))
positions_mongo = [pos + bar_width for pos in positions_default]

# Plot
plt.figure(figsize=(10, 6))
bars_default = plt.bar(positions_default, default_times, bar_width, label='HSQLDB', color="skyblue", edgecolor="black")
bars_mongo = plt.bar(positions_mongo, mongo_times, bar_width, label='MongoDB (Docker)', color="coral",
                     edgecolor="black")

for bar in bars_default:
    height = bar.get_height()
    plt.text(
        bar.get_x() + bar.get_width() / 2,
        height + 10,
        f'{height:.1f}',
        ha='center',
        va='bottom',
        fontsize=9,
        fontweight='bold'
    )

for bar in bars_mongo:
    height = bar.get_height()
    plt.text(
        bar.get_x() + bar.get_width() / 2,
        height + 10,
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

# Labels and titles
plt.xlabel('Collection Size')
plt.ylabel('Execution Time (ms)')
# plt.title('Execution Time Comparison')
plt.xticks([pos + bar_width / 2 for pos in positions_default], steps)
plt.legend()

# Show plot
# plt.tight_layout()
plt.show()
# plt.savefig("index.pdf", format="pdf")
