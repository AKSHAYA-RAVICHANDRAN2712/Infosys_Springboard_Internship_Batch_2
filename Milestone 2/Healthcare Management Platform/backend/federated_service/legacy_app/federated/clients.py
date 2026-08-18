import numpy as np


NUM_CLIENTS = 4


def create_client_data():
    clients = {}

    for i in range(1, NUM_CLIENTS + 1):
        np.random.seed(i)

        x = np.random.normal(
            loc=i * 0.2,
            scale=1.0,
            size=(100, 4)
        ).astype(np.float32)

        y = (np.sum(x, axis=1) > 0).astype(np.int32)

        clients[f"client_{i}"] = (x, y)

    return clients
def create_evaluation_data():
    np.random.seed(100)

    x = np.random.normal(
        loc=0.5,
        scale=1.0,
        size=(400, 4)
    ).astype(np.float32)

    y = (np.sum(x, axis=1) > 0).astype(np.int32)

    return x, y
