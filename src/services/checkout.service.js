'use strict'

const { findCartById } = require("../models/repositories/cart.repo");
const {
    BadRequestError,
    NotFoundError
} = require('../core/error.response');
const { checkProduct } = require("../models/repositories/product.repo");
const DiscountService = require("./discount.service");
const { acquirelock, releaseLock } = require("./redis.server");
const { order } = require("../models/order.model");



class CheckoutService{
    
    static async checkoutReview({
        cartId, userId, shop_order_ids
    }){
        //check cartId exists?

        const foundCart = await findCartById(cartId);
        if(!foundCart) throw new BadRequestError('Cart does not exists');


        const checkout_order = {
            totalPrice: 0,
            freeShip: 0,
            totalDiscount:0,
            totalCheckout: 0
        }
        const shop_order_ids_new  = []

        for(let i = 0; i<shop_order_ids.length; i++){
            const {shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]

            // check product avariable
            const checkProductServer = await checkProduct(item_products)
            console.log(`checkProductServer: ${checkProductServer.price} - ${checkProductServer.quantity}`);

            if(!checkProductServer[0]) throw new BadRequestError("order wrong!!");

            

            // total order
            const checkoutPrice = checkProductServer.reduce((acc, product) =>{
                return acc + (product.quantity * product.price)
            }, 0)

            // total price

            checkout_order.totalPrice += checkoutPrice



            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // if shop_discount is exists


            if(shop_discounts.length > 0){
                // gia su chi co 1 discount


                const {totalPrice = 0, discount = 0} = await DiscountService.getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                    
                })

                // tong discount 

                checkout_order.totalDiscount += discount

                if(discount > 0){
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }



                // tong thanh toan cuoi cung


                
            }
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout);
            

        }

        return{
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }


    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment= {}
    }){
        const {shop_order_ids_new, checkout_order} = this.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        });


        // check lai 1 lan nua xem vuot ton kho khong
        // get new array product
        const products = shop_order_ids_new.flatMap(
            order => order.item_products
        )
        const acquireProduct = []

        for (let i = 0; i < products.length; i++) {
            const {productId, quantity}  = products[i]
            const keyLock = await acquirelock(productId, quantity,  cartId)
            acquireProduct.push(keyLock ? true : false)

            if(keyLock){
                await releaseLock(keyLock)
            }
        }


        // check if hava a product is out of stock in inventory
        if(acquireProduct.includes(false)){
            throw new BadRequestError("Some product hava been updata, Please come back your cart")
        }

        const newOrder = order.create({
            order_userId:userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment:user_payment,
            order_products:shop_order_ids_new
        })

       // if case insert success full then remove product in your cart
       if(newOrder){

       }

        return newOrder;
    }


    /**
        1 Query Order |USER|
     */

    static async getOrdersByUser(){

    }

    
    /**
        2 Query Order Using Id |USER|
     */

    static async getOneOrderByUser(){
    
    }

    /**
        3 Cancel Order |USER|
     */

    static async cancleOrderByUser(){

    }

    /**
        4 Update Order |ADMIN|
     */

    static async updateOrderStatusByShop(){

    }
}


module.exports = CheckoutService