"use strict";

const { default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "comment";
const COLLECTION_NAME = "comments";

const commentSchema = new mongoose.Schema(
    {
        comment_product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        comment_userId: {
            type: Number,
            default: 1,
        },
        comment_content: {
            type: String,
            default: "text",
        },
        comment_left: {
            type: Number,
            default: 0,
        },
        comment_right: {
            type: Number,
            default: 0,
        },
        comment_parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: DOCUMENT_NAME,
        },
        isDelete: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, commentSchema);
