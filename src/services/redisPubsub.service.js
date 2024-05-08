const redis = require("redis");

class RedisPubSubService {
    constructor() {
        this.subscriber = redis.createClient();
        this.publisher = redis.createClient();
    }

    publish(channel, message) {
        return new Promise((resovel, reject) => {
            this.publisher.publish(channel, message, (err, replpy) => {
                if (err) return reject(err);
                return resovel(replpy);
            });
        });
    }

    subscribe(channel, callback) {
        this.subscriber.subscribe(channel);
        this.subscriber.on("message", (subscriberChannel, message) => {
            if (channel === subscriberChannel) {
                callback(channel, message);
            }
        });
    }
}

module.exports = new RedisPubSubService();
