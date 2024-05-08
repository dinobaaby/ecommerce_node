"use strict";
const { createComment } = require("../services/comment.service");
const { OK } = require("../core/success.response");
class CommentController {
    createComment = async (req, res, next) => {
        OK(res, "Create new comment success", await createComment(req.body));
    };
}

module.exports = new CommentController();
