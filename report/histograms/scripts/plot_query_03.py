from pathlib import Path
import os

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
os.environ.setdefault("MPLCONFIGDIR", str(ROOT / ".matplotlib-cache"))
os.environ.setdefault("XDG_CACHE_HOME", str(ROOT / ".cache"))

import matplotlib.pyplot as plt

DATA_PATH = ROOT / "data" / "query_03.csv"
OUTPUT_PATH = ROOT / "query-03-histogram.png"


def main() -> None:
    data = pd.read_csv(DATA_PATH)

    plt.figure(figsize=(9, 5.2))
    plt.scatter(
        data["typeface_count"],
        data["symbol_count"],
        s=180,
        color="#2f6f9f",
        edgecolor="#17324d",
        linewidth=1.2,
    )

    for row in data.itertuples(index=False):
        plt.annotate(
            row.format_name,
            (row.typeface_count, row.symbol_count),
            textcoords="offset points",
            xytext=(8, 6),
            fontsize=10,
        )

    plt.title("Typeface and symbol counts by format")
    plt.xlabel("Typeface count")
    plt.ylabel("Symbol count")
    plt.grid(True, linestyle="--", alpha=0.35)
    plt.tight_layout()
    plt.savefig(OUTPUT_PATH, dpi=220)


if __name__ == "__main__":
    main()
