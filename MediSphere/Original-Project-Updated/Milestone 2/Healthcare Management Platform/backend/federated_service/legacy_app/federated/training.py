import tensorflow as tf
import tensorflow_federated as tff

from app.federated.model import create_keras_model


INPUT_SHAPE = (4,)
NUM_CLASSES = 2


def model_fn():
    keras_model = create_keras_model()

    return tff.learning.models.from_keras_model(
        keras_model,
        input_spec=(
            tf.TensorSpec(shape=(None, 4), dtype=tf.float32),
            tf.TensorSpec(shape=(None,), dtype=tf.int32),
        ),
        loss=tf.keras.losses.SparseCategoricalCrossentropy(),
        metrics=[
            tf.keras.metrics.SparseCategoricalAccuracy()
        ],
    )


def create_federated_process():
    return tff.learning.algorithms.build_weighted_fed_avg(
        model_fn=model_fn,
        client_optimizer_fn=tff.learning.optimizers.build_sgdm(
            learning_rate=0.05
        ),
        server_optimizer_fn=tff.learning.optimizers.build_sgdm(
            learning_rate=1.0
        ),
    )
