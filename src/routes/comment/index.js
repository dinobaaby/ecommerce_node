"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");

const CommentController = require("../../controllers/comment.controller");

router.post("", asyncHandler(CommentController.createComment));
router.delete("", asyncHandler(CommentController.deleteComment));
router.get("", asyncHandler(CommentController.getCommentsByParentId));

module.exports = router;
