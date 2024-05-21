"use strict";
const asyncHandler = require("../../helpers/asyncHandler");
const UploadController = require("../../controllers/upload.controller");
const { uploadDisk, uploadMemory } = require("../../configs/multer.config");
const express = require("express");
const router = express.Router();

router.post("/product", asyncHandler(UploadController.uploadFile));
router.post(
    "/product/thumb",
    uploadDisk.single("file"),
    asyncHandler(UploadController.uploadFileThumb)
);
router.post(
    "/product/multiple",
    uploadDisk.array("files", 3),
    asyncHandler(UploadController.uploadImageFromLocalFiles)
);

// upload s3
router.post(
    "/product/bucket",
    uploadMemory.single("file"),
    asyncHandler(UploadController.uploadImageFromLocalS3)
);
module.exports = router;
