'use strict';

const { default: mongoose } = require("mongoose");

const {db : {name, port, host}} = require("../configs/config.mongodb");

const connectString = `mongodb://${host}:${port}/${name}`

console.log(connectString);
mongoose.connect(connectString)
    .then(_ => console.log("Connected mongobb success"))
    .catch(err => console.log('Error connecting:' , err))

// dev
if (1 === 0){
    mongoose.set('debug', true)
    mongoose.set('debug', {color: true})
}

module.exports = mongoose