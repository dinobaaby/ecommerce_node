"use strict";

const Comment = require("../models/comment.model");
const { convertToObjectIdMongodb } = require("../utils");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { findProduct } = require("../models/repositories/product.repo");
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
        //await this.validateProductExists(productId);

        const comment = new Comment({
            comment_product_id: productId,
            comment_user_id: userId,
            comment_content: content,
            comment_parent_id: parentCommentId,
        });

        let rightValue = 0;
        if (parentCommentId) {
            // reply comment
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment)
                throw new NotFoundError("Parent comment not found");

            rightValue = parentComment.comment_right;

            // updateMany comments
            await Comment.updateMany(
                {
                    comment_product_id: convertToObjectIdMongodb(productId),
                    comment_right: { $gte: rightValue },
                },
                {
                    $inc: { comment_right: 2 },
                }
            );

            // updateMany comments
            await Comment.updateMany(
                {
                    comment_product_id: convertToObjectIdMongodb(productId),
                    comment_left: { $gt: rightValue },
                },
                {
                    $inc: { comment_left: 2 },
                }
            );
        } else {
            const maxRightValue = await Comment.findOne(
                {
                    comment_product_id: convertToObjectIdMongodb(productId),
                },
                "comment_right",
                { sort: { comment_right: -1 } }
            );
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1;
            } else {
                rightValue = 1;
            }
        }

        console.log("rightValue::", rightValue);
        // insert to comment
        comment.comment_left = rightValue;
        comment.comment_right = rightValue + 1;

        await comment.save();
        return comment;
    }

    static async getCommentsByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0,
    }) {
        if (parentCommentId) {
            const parent = await Comment.findById(parentCommentId);
            if (!parent)
                throw new NotFoundError("Not found comment for product");

            return Comment.find({
                comment_product_id: convertToObjectIdMongodb(productId),
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lte: parent.comment_right },
            })
                .select({
                    comment_left: 1,
                    comment_right: 1,
                    comment_content: 1,
                    comment_parent_id: 1,
                })
                .sort({
                    comment_left: 1,
                });
        }

        return Comment.find({
            comment_product_id: convertToObjectIdMongodb(productId),
            comment_parent_id: parentCommentId,
        })
            .select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parent_id: 1,
            })
            .sort({
                comment_left: 1,
            });
    }

    static async deleteComment({ commentId, productId }) {
        // check the product exists in the database
        const foundProduct = await findProduct({
            product_id: productId,
        });

        if (!foundProduct) {
            throw new NotFoundError("Product not found");
        }

        // 1. Determine the left and right values
        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new NotFoundError("Comment not found");
        }

        const leftValue = comment.comment_left;
        const rightValue = comment.comment_right;

        // 2. calculate the width of the node
        const width = rightValue - leftValue + 1;

        // 3. delete the node and all of its children

        await Comment.deleteMany({
            comment_parentId: convertToObjectIdMongodb(productId),
            comment_left: { $gte: leftValue, $lte: rightValue },
        });

        // 4. update the left and right values of the nodes that are to the right of the node

        await Comment.updateMany(
            {
                comment_product_id: convertToObjectIdMongodb(productId),
                comment_right: { $gt: rightValue },
            },
            {
                $inc: { comment_right: -width },
            }
        );
        await Comment.updateMany(
            {
                comment_product_id: convertToObjectIdMongodb(productId),
                comment_left: { $gt: rightValue },
            },
            {
                $inc: { comment_left: -width },
            }
        );

        return true;
    }
}

module.exports = CommentService;
