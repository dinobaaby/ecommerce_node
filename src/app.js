require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

// console.log(`Process: `, process.env);
// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// test pub.sub redis
require("./tests/inventory.test");
const productTest = require("./tests/product.test");
productTest.purchaseProduct("product1", 10);
// init db
require("./dbs/init.mongodb");
// const {checkOverLoad} = require('./helpers/check.connect')
// checkOverLoad()

// init routes
app.use("/", require("./routes/index"));

// handling error
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        stack: error.stack,
        message: error.message || "Internal Server Error",
    });
});

module.exports = app;
