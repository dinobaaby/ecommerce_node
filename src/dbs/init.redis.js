"use strict";

const redis = require("redis");

let client = {};
let statusConnectRedis = {
  CONNECT: "connect",
  END: "end",
  RECONNECT: "reconnecting",
  ERROR: "error",
};

const handleEventConnect = ({ connectionRedis }) => {
  // check if connection is null

  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log("connectionRedis - Connection status : connected");
  });

  connectionRedis.on(statusConnectRedis.END, () => {
    console.log("connectionRedis - Connection status : disconected");
  });

  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log("connectionRedis - Connection status : reconnecting");
  });

  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.log(`connectionRedis - Connection status error : ${err}`);
  });
};
const initRedis = () => {
  const instanceRedis = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
    username: process.env.REDIS_USERNAME,
  });

  client.instanceConnect = instanceRedis;
  handleEventConnect(instanceRedis);

  return instanceRedis;
};

const getRedis = () => {};

const closeRedis = () => {};

module.exports = {
  initRedis,
  getRedis,
  closeRedis,
};
