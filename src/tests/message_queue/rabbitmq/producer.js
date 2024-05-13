const amqp = require("amqplib");

const messages = "Hello Dinobaby";

const runProducer = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:12345@localhost");
        const channel = await connection.createChannel();

        const queueName = "test-topic";

        await channel.assertQueue(queueName, {
            durable: true,
        });

        //  send message to the consumer
        channel.sendToQueue(queueName, Buffer.from(messages));
        console.log(`Producer send message: ${messages}`);
    } catch (err) {
        console.log(err);
    }
};

runProducer().catch(console.error);