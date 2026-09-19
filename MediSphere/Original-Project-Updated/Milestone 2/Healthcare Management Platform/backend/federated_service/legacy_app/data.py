import numpy as np

def create_client_datasets(num_clients=4, samples_per_client=160, seed=42):
    # Synthetic demonstration data only. No patient data.
    rng = np.random.default_rng(seed)
    datasets = []

    for client_id in range(num_clients):
        shift = (client_id - (num_clients - 1) / 2) * 0.15
        x = rng.normal(loc=shift, scale=1.0,
                       size=(samples_per_client, 2)).astype(np.float32)
        score = (1.6 * x[:, 0] - 1.1 * x[:, 1] +
                 0.25 * np.sin(x[:, 0]) +
                 rng.normal(0, 0.35, samples_per_client))
        y = (score > 0).astype(np.float32).reshape(-1, 1)

        split = int(samples_per_client * 0.8)
        datasets.append({
            "client_id": f"client_{client_id + 1}",
            "train_x": x[:split], "train_y": y[:split],
            "test_x": x[split:], "test_y": y[split:]
        })

    return datasets
