"use strict";
const amqp = require("amqplib");

async function consumerOrderedMessage() {
    const connection = await amqp.connect("amqp://guest:12345@localhost");
    const channel = await connection.createChannel();

    const queueName = "order-queue-message";

    await channel.assertQueue(queueName, {
        durable: true,
    });

    for (let i = 0; i < 10; i++) {
        const message = `Ordered-queue-message-${i}`;
        console.log(message);
        channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true,
        });
    }

    setTimeout(() => {
        connection.close();
    }, 1000);
}

consumerOrderedMessage().catch((err) => console.error(err));
