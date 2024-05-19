"use strict";
const amqp = require("amqplib");

async function consumerOrderedMessage() {
    const connection = await amqp.connect("amqp://guest:12345@localhost");
    const channel = await connection.createChannel();

    const queueName = "order-queue-message";

    await channel.assertQueue(queueName, {
        durable: true,
    });

    // set prefetch to 1 to ensure only one ack at a time
    channel.prefetch(1);

    channel.consume(queueName, (msg) => {
        const massage = msg.content.toString();
        setTimeout(() => {
            console.log(`Processed: ${massage}`);
            channel.ack(msg);
        }, Math.random() * 1000);
    });
}

consumerOrderedMessage().catch((err) => console.error(err));
