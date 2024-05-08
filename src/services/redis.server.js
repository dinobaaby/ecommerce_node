"use strict";

const redis = require("redis");
const { promisify } = require("util");
const redisClient = redis.createClient();

// pexpire
const pexpire = promisify(redisClient.pexpire).bind(redisClient); // Fixed typo
const setnxAsync = promisify(redisClient.setnx).bind(redisClient); // Fixed typo

redisClient.ping((err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Redis is connected");
    }
});

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2024_${productId}`;

    const retryTimes = 10;
    const expireTime = 30000; // 30 seconds

    for (let i = 0; i < retryTimes; i++) {
        // Fixed loop condition
        const result = await setnxAsync(key, expireTime);

        if (result === 1) {
            // thao tac voi inventory
            const isReservation = await reservationInventory({
                productId,
                quantity,
                cartId,
            });
            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime);
                return key;
            }
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
};

const releaseLock = async (keylock) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keylock);
};

module.exports = {
    acquireLock, // Fixed function name
    releaseLock,
};
