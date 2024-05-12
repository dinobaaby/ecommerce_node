"use strict";

const { default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

// Order-001: order successfully
// Order-002: order failed
// Promotion-001: new promotion
// Shop-001: new product by user following

const notificationSchema = new mongoose.Schema(
    {
        noti_type: {
            type: String,
            enum: ["ORDER-001", "ORDER-001", "PROMOTION-001", "SHOP-001"],
            required: true,
        },
        noti_senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Shop",
        },
        noti_receivedId: {
            type: String,
            required: true,
        },
        noti_content: {
            type: String,
            required: true,
        },
        noti_options: {
            type: Object,
            default: {},
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, notificationSchema);
