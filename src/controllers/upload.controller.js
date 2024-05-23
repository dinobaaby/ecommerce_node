"use strict";

const { OK } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");
const {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalFiles,
    uploadImageFromLocalS3,
    getImageUrlFromS3,
} = require("../services/upload.service");
class UploadController {
    uploadFile = async (req, res, next) => {
        OK(res, "Upload file successfully", await uploadImageFromUrl());
    };

    uploadFileThumb = async (req, res, next) => {
        const { file } = req;
        if (!file) {
            throw new BadRequestError("File missing");
        }
        OK(
            res,
            "Upload file from local successfully",
            await uploadImageFromLocal({
                path: file.path,
            })
        );
    };

    uploadImageFromLocalFiles = async (req, res, next) => {
        const { files } = req;
        if (!files.length) {
            throw new BadRequestError("File missing");
        }
        OK(
            res,
            "Upload file from local successfully",
            await uploadImageFromLocalFiles({
                files,
            })
        );
    };

    uploadImageFromLocalS3 = async (req, res, next) => {
        const { file } = req;
        if (!file) {
            throw new BadRequestError("File missing");
        }
        OK(
            res,
            "Upload file from local use s3 successfully",
            await uploadImageFromLocalS3({
                file,
            })
        );
    };

    getImageUrlFromS3 = async (req, res, next) => {
        OK(
            res,
            "Get file from local use s3 successfully",
            await getImageUrlFromS3({
                ...req.body,
            })
        );
    };
}

module.exports = new UploadController();
