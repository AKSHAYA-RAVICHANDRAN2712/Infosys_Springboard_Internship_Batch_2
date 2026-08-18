import csv
from pathlib import Path


class DatasetLoader:

    DATASET_PATH = (
        Path(__file__).resolve().parents[2]
        / "datasets"
        / "framingham.csv"
    )

    def load_dataset(self):

        rows = []

        try:
            with open(
                self.DATASET_PATH,
                mode="r",
                encoding="utf-8"
            ) as file:

                reader = csv.reader(file)

                # Read header
                header = next(reader, None)

                if header is None:
                    raise RuntimeError("Dataset is empty.")

                print("--------------------------------")
                print("Dataset loaded successfully!")
                print("--------------------------------")
                print("Columns:")
                print(header)

                # Read data rows
                for row in reader:

                    if not row:
                        continue

                    rows.append(row)

            print("--------------------------------")
            print("Total rows loaded:", len(rows))
            print("--------------------------------")

            return rows

        except Exception as e:

            raise RuntimeError(
                f"Failed to load Framingham dataset: {e}"
            )