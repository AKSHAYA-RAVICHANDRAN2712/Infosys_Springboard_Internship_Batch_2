const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "medisphere-healthcare",
  brokers: [
    process.env.KAFKA_BROKER || "localhost:9092"
  ],
});

const producer = kafka.producer();

const consumer = kafka.consumer({
  groupId: "medisphere-anomaly-detection",
});

module.exports = {
  kafka,
  producer,
  consumer,
};