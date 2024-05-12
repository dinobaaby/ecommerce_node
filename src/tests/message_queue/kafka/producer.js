const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["0.0.0.0:9092"],
});
const producer = kafka.producer();

const runProducer = async () => {
    await producer.connect();
    await producer.send({
        topic: "test-topic",
        messages: [{ value: "Hello KafkaJS By Dinobabayy !" }],
    });

    await producer.disconnect();
};

runProducer().catch(console.error);
