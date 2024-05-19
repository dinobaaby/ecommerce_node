const amqp = require("amqplib");

const messages = "DinoooooBaby";

// const log = console.log;
// console.log = function () {
//     log.apply(console, [new Date()].concat(arguments));
// };
const runProducer = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:12345@localhost");
        const channel = await connection.createChannel();

        const notificationExchange = "notificationEx"; //declare exchange
        const notiQueue = "notificationQueueProcess"; // assertQueue
        const notificationExchangeDLX = "notificationExDLX"; //declare exchange
        const notificationRoutingKeyDLX = "notificationRoutingKeyDLX"; // routing key

        // 1. create exchange
        await channel.assertExchange(notificationExchange, "direct", {
            durable: true,
        });

        // 2. create queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, // allow other connection to access the queue at the same time
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX,
        });

        // 3/ bind queue
        await channel.bindQueue(queueResult.queue, notificationExchange);

        // 4. Sen message

        const msg = "a new product has been added";

        console.log("Producer send message: ", msg);
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: "10000",
        });
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (err) {
        console.log(err);
    }
};

runProducer()
    .then((rs) => console.log(rs))
    .catch(console.error);
