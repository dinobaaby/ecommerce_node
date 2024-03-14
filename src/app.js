const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init middlewares



// init db


// init routes

app.get('/', (req, res, next) => {
    const strCompress = "Hello dino"
    return res.status(200).json({
        message: "Hi Dino",
        metaData: strCompress.repeat(10000)
    })
})

// handling error




module.exports = app