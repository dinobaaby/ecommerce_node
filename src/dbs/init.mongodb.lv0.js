'use strict';

const { default: mongoose } = require("mongoose");


const connectString = "mongodb://localhost:27017/shopDev"
mongoose.connect(connectString)
    .then(_ => console.log("Connected mongobb success"))
    .catch(err => console.log('Error connecting:' , err))

// dev
if (1 === 0){
    mongoose.set('debug', true)
    mongoose.set('debug', {color: true})
}

module.exports = mongoose