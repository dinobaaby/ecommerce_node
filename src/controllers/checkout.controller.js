'use strict'

const {
    OK
} = require('../core/success.response')

const CheckoutService = require('../services/checkout.service')

class CheckoutController{


    checkoutReview = async(req, res, next) =>{
        OK(
            res,
            "Checkout review",
            await CheckoutService.checkoutReview(req.body)
        )
    }



}


module.exports = new CheckoutController()