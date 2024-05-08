"use strict";

const Comment = require("../models/comment.model");
const { convertToObjectIdMongodb } = require("../utils");
const { BadRequestError, NotFoundError } = require("../core/error.response");
/**
 * Key : features: Commnet service
 * add comment [User, Shops]
 * get a list of comments [User, Shops]
 * delete comment [User, Shops, Admin]
 */

class CommentService {
    static async createComment({
        productId,
        userId,
        content,
        parentCommentId = null,
    }) {
        const comment = new Comment({
            comment_parentId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId,
        });

        let rightValue;
        if (parentCommentId) {
            // reply comment
            const parentCommnet = await Comment.findById(parentCommentId);
            if (!parentCommnet) {
                throw new NotFoundError("Parent comment not found");
            }
            rightValue = parentCommnet.comment_right;
            // updateMany comments
            await Comment.updateMany(
                {
                    comment_parentId: convertToObjectIdMongodb(productId),
                    comment_right: { $gte: rightValue },
                },
                {
                    $inc: { comment_right: 2 },
                }
            );
            await Comment.updateMany(
                {
                    comment_parentId: convertToObjectIdMongodb(productId),
                    comment_left: { $gt: rightValue },
                },
                {
                    $inc: { comment_left: 2 },
                }
            );
        } else {
            const maxRightValue = await Comment.findOne(
                {
                    comment_parentId: convertToObjectIdMongodb(productId),
                },
                "comment_right"
            ).sort({ comment_right: -1 });
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1;
            } else {
                rightValue = 1;
            }
        }

        // insert comment
        comment.comment_left = rightValue;
        comment.comment_right = rightValue + 1;

        await comment.save();

        return comment;
    }
}

module.exports = CommentService;
