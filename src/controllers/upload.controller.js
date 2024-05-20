"use strict";

const { OK } = require("../core/success.response");
const { uploadImageFromUrl } = require("../services/upload.service");
class UploadController {
    uploadFile = async (req, res, next) => {
        OK(res, "Upload file successfully", await uploadImageFromUrl());
    };
}

module.exports = new UploadController();
