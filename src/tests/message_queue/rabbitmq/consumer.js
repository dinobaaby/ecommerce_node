const amqp = require("amqplib");

const messages = "Hello Dinobaby";

const runConsumer = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:12345@localhost");
        const channel = await connection.createChannel();

        const queueName = "test-topic";

        await channel.assertQueue(queueName, {
            durable: true,
        });

        //  send message to the consumer
        channel.consume(
            queueName,
            (messages) => {
                console.log(
                    `Consumer received message: ${messages.content.toString()}`
                );
            },
            {
                noAck: true,
            }
        );
    } catch (err) {
        console.log(err);
    }
};

runConsumer().catch(console.error);
