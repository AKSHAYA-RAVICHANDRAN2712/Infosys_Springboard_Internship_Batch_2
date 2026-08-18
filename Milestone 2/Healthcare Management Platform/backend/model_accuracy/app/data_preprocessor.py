import numpy as np


class DataPreprocessor:

    FEATURE_COUNT = 15

    def prepare_data(self, rows):

        valid_features = []
        targets = []

        for row in rows:

            # We need exactly 16 columns
            if len(row) != 16:
                continue

            try:
                features = []

                # First 15 columns are features
                for i in range(self.FEATURE_COUNT):
                    features.append(self.parse_value(row[i]))

                # Last column is target
                target = int(row[15].strip())

                # Target must be 0 or 1
                if target not in (0, 1):
                    continue

                valid_features.append(features)
                targets.append(target)

            except ValueError:
                # Skip rows containing invalid numeric values
                continue

        # Convert to NumPy arrays
        x = np.array(valid_features, dtype=float)
        y = np.array(targets, dtype=int)

        # Replace missing values with median
        self.impute_missing_values(x)

        print("--------------------------------")
        print("Preprocessing completed.")
        print("--------------------------------")
        print("Usable rows:", len(x))
        print("Feature count:", self.FEATURE_COUNT)
        print("Missing values handled using median imputation.")
        print("--------------------------------")

        return x, y

    def parse_value(self, value):

        if value is None:
            return np.nan

        value = value.strip()

        if value == "" or value.upper() == "NA":
            return np.nan

        return float(value)

    def impute_missing_values(self, data):

        for column in range(self.FEATURE_COUNT):

            column_values = data[:, column]

            # Calculate median ignoring NaN values
            median = np.nanmedian(column_values)

            # Find missing values
            missing = np.isnan(column_values)

            # Replace missing values with median
            data[missing, column] = median