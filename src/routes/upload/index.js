"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const UploadController = require("../../controllers/upload.controller");
router.post("/product", asyncHandler(UploadController.uploadFile));
module.exports = router;
