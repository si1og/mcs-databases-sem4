from pathlib import Path
import os

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
os.environ.setdefault("MPLCONFIGDIR", str(ROOT / ".matplotlib-cache"))
os.environ.setdefault("XDG_CACHE_HOME", str(ROOT / ".cache"))

import matplotlib.pyplot as plt

DATA_PATH = ROOT / "data" / "query_08.csv"
OUTPUT_PATH = ROOT / "query-08-histogram.png"


def main() -> None:
    data = pd.read_csv(DATA_PATH)
    matrix = data.pivot(
        index="category_name",
        columns="language_name",
        values="symbol_count",
    )

    plt.figure(figsize=(11, 6.4))
    image = plt.imshow(matrix, cmap="YlGnBu", aspect="auto")
    plt.colorbar(image, label="Symbol count")

    plt.xticks(range(len(matrix.columns)), matrix.columns, rotation=35, ha="right")
    plt.yticks(range(len(matrix.index)), matrix.index)
    plt.title("Symbol counts by category and language")
    plt.xlabel("Language")
    plt.ylabel("Category")

    for row_index, category in enumerate(matrix.index):
        for column_index, language in enumerate(matrix.columns):
            value = int(matrix.loc[category, language])
            plt.text(
                column_index,
                row_index,
                str(value),
                ha="center",
                va="center",
                fontsize=7,
                color="#10202f",
            )

    plt.tight_layout()
    plt.savefig(OUTPUT_PATH, dpi=220)


if __name__ == "__main__":
    main()
