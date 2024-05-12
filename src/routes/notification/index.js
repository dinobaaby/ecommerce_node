"use strict";

const express = require("express");

const asyncHandler = require("../../helpers/asyncHandler");
const notificationController = require("../../controllers/notification.controller");

const router = express.Router();
// not login

// login
router.get("", asyncHandler(notificationController.listNotiByUser));
module.exports = router;
