'use strict'


const CartService = require("../services/cart.service")

const { OK } = require('../core/success.response')

class CartController{

    /**
     * @desc add to cart for user
     * @param {int} userId 
     * @param {*} res 
     * @param {*} next 
     * @method POST
     * `
     */
    addToCart = async(req, res, next) =>{
        OK(
            res,
            "Create new Cart success",
            await CartService.addToCart(req.body)
        );
        
    }


    update = async(req, res, next) =>{
        OK(
            res,
            "update cart success",
            await CartService.addToCastV2(req.body)
        );
        
    }



    delete = async(req, res, next) =>{
        OK(
            res,
            "delte cart success",
            await CartService.deleteItemInUserCart(req.body)
        );
        
    }

    listToCart = async(req, res, next) =>{
        OK(
            res,
            "get list cart success",
            await CartService.getListUserCart(req.query)
        );
        
    }

}


module.exports = new CartController()