"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");

const CommentController = require("../../controllers/comment.controller");

router.post("", asyncHandler(CommentController.createComment));
module.exports = router;
