'use strict';

const { default: mongoose } = require("mongoose");
const os = require("os");
const process = require("process");

const _SECONDS = 5000
// count connection
const countConnect = () => {
    const numConnections = mongoose.connections.length;
    console.log("Number of connections: " + numConnections);
}

// check over load connection
const checkOverLoad = () => {
    setInterval(
        () =>{
            const numConnections = mongoose.connections.length;
            const numCores = os.cpus().length;
            const memoryUsage = process.memoryUsage().rss;

            // Example maximun number of conections based on number asf cores
            const maxConnections = numCores * 5;
            console.log("Active conections: " + numConnections);
            console.log(`Memory usage: ${memoryUsage/1024/1024} MB`);

            if(numConnections > maxConnections){
                console.log("Connection overloade detected");
            }

        },
        _SECONDS // monitor every 5 seconds
    )
}


module.exports = {
    countConnect,
    checkOverLoad
}