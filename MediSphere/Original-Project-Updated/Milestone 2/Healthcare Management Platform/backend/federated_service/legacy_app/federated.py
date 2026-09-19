import collections
import numpy as np
import tensorflow as tf
import tensorflow_federated as tff

tf.get_logger().setLevel("ERROR")

BATCH_SIZE = 16

def build_model():
    return tf.keras.Sequential([
        tf.keras.layers.Input(shape=(2,)),
        tf.keras.layers.Dense(8, activation="relu"),
        tf.keras.layers.Dense(4, activation="relu"),
        tf.keras.layers.Dense(1, activation="sigmoid"),
    ])

def model_input_spec():
    return collections.OrderedDict(
        x=tf.TensorSpec(shape=(None, 2), dtype=tf.float32),
        y=tf.TensorSpec(shape=(None, 1), dtype=tf.float32),
    )

def make_tf_dataset(client):
    ds = tf.data.Dataset.from_tensor_slices({
        "x": client["train_x"], "y": client["train_y"]
    })
    return ds.shuffle(len(client["train_x"]), seed=123).batch(BATCH_SIZE)

def make_test_dataset(clients):
    x = np.concatenate([c["test_x"] for c in clients], axis=0)
    y = np.concatenate([c["test_y"] for c in clients], axis=0)
    return tf.data.Dataset.from_tensor_slices({
        "x": x.astype(np.float32), "y": y.astype(np.float32)
    }).batch(BATCH_SIZE)

def model_fn():
    return tff.learning.models.from_keras_model(
        build_model(),
        input_spec=model_input_spec(),
        loss=tf.keras.losses.BinaryCrossentropy(),
        metrics=[tf.keras.metrics.BinaryAccuracy(name="accuracy")],
    )

def create_federated_algorithm():
    return tff.learning.algorithms.build_weighted_fed_avg(
        model_fn=model_fn,
        client_optimizer_fn=tff.learning.optimizers.build_sgdm(
            learning_rate=0.05
        ),
        server_optimizer_fn=tff.learning.optimizers.build_sgdm(
            learning_rate=1.0
        ),
    )

def _load_weights(model, weights):
    model.set_weights(
        [np.asarray(w) for w in weights.trainable] +
        [np.asarray(w) for w in weights.non_trainable]
    )

def evaluate_global_weights(weights, clients):
    model = build_model()
    model.compile(optimizer="sgd", loss="binary_crossentropy", metrics=["accuracy"])
    _load_weights(model, weights)
    result = model.evaluate(make_test_dataset(clients), verbose=0, return_dict=True)
    return float(result["accuracy"])

def client_update_metrics(client, weights):
    model = build_model()
    model.compile(optimizer="sgd", loss="binary_crossentropy", metrics=["accuracy"])
    _load_weights(model, weights)
    ds = tf.data.Dataset.from_tensor_slices({
        "x": client["train_x"], "y": client["train_y"]
    }).batch(BATCH_SIZE)
    result = model.evaluate(ds, verbose=0, return_dict=True)
    return float(result["accuracy"])
