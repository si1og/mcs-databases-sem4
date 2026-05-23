from pathlib import Path
import os

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
os.environ.setdefault("MPLCONFIGDIR", str(ROOT / ".matplotlib-cache"))
os.environ.setdefault("XDG_CACHE_HOME", str(ROOT / ".cache"))

import matplotlib.pyplot as plt

DATA_PATH = ROOT / "data" / "query_08.csv"
OUTPUT_PATH = ROOT / "query-08-histogram.png"

plt.rcParams.update(
    {
        "axes.titlesize": 28,
        "axes.labelsize": 23,
        "xtick.labelsize": 19,
        "ytick.labelsize": 19,
        "legend.fontsize": 17,
    }
)


def main() -> None:
    data = pd.read_csv(DATA_PATH)
    matrix = data.pivot(
        index="category_name",
        columns="language_name",
        values="symbol_count",
    )
    category_positions = range(len(matrix.index))
    bar_width = 0.075
    colors = plt.cm.tab10.colors

    fig, axis = plt.subplots(figsize=(22, 11.0))

    for language_index, language in enumerate(matrix.columns):
        offsets = [
            position
            + (language_index - (len(matrix.columns) - 1) / 2) * bar_width
            for position in category_positions
        ]
        axis.bar(
            offsets,
            matrix[language],
            width=bar_width,
            label=language,
            color=colors[language_index % len(colors)],
        )

    axis.set_title("Symbol counts by category and language", pad=30)
    axis.set_xlabel("Category")
    axis.set_ylabel("Symbol count")
    axis.set_xticks(list(category_positions))
    axis.set_xticklabels(matrix.index, rotation=25, ha="right")
    axis.grid(axis="y", linestyle="--", alpha=0.35)
    axis.legend(ncol=1, loc="center left", bbox_to_anchor=(1.01, 0.5))
    axis.margins(x=0.01)

    fig.tight_layout()
    fig.savefig(OUTPUT_PATH, dpi=220, bbox_inches="tight", pad_inches=0.3)


if __name__ == "__main__":
    main()
