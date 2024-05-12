"use strict";
const {
    createComment,
    getCommentsByParentId,
    deleteComment,
} = require("../services/comment.service");
const { OK } = require("../core/success.response");
class CommentController {
    createComment = async (req, res, next) => {
        OK(res, "Create new comment success", await createComment(req.body));
    };

    getCommentsByParentId = async (req, res, next) => {
        OK(
            res,
            "Get list of comments success",
            await getCommentsByParentId(req.query)
        );
    };

    deleteComment = async (req, res, next) => {
        OK(res, "Delete comment success", await deleteComment(req.body));
    };
}

module.exports = new CommentController();
