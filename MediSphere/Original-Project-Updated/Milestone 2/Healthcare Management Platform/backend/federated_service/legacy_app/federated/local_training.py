import tensorflow as tf


def create_local_model():
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(4,)),
        tf.keras.layers.Dense(16, activation="relu"),
        tf.keras.layers.Dense(8, activation="relu"),
        tf.keras.layers.Dense(2, activation="softmax")
    ])

    model.compile(
        optimizer=tf.keras.optimizers.SGD(learning_rate=0.05),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )

    return model


def calculate_client_accuracy(
    x,
    y,
    global_weights
):
    model = create_local_model()

    # TFF ModelWeights contains:
    # trainable weights + non-trainable weights
    flat_weights = (
        list(global_weights.trainable)
        + list(global_weights.non_trainable)
    )

    model.set_weights(flat_weights)

    model.fit(
        x,
        y,
        epochs=1,
        batch_size=20,
        verbose=0
    )

    _, accuracy = model.evaluate(
        x,
        y,
        verbose=0
    )

    return float(accuracy)
