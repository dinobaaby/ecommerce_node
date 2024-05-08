'use strict'


const express  = require("express");
const checkoutController = require('../../controllers/checkout.controller')
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');


router.post('/review', asyncHandler(checkoutController.checkoutReview))




module.exports = router