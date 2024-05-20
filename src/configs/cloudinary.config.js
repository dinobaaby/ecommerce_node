"use strict";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "dr3ca54ik",
    api_key: "573557912971235",
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
