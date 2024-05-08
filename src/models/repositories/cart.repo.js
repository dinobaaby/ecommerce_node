'use strict'

const { cart } = require('../cart.model')

const createUserCart = async ({userId, product}) =>{
    const query = {cart_userId: userId, cart_state: 'active'}

    const updateOrInsert = {
        $addToSet:{
            cart_products: product
        }
    }
    const options = {upsert: true, new: true}


    return await cart.findOneAndUpdate(query, updateOrInsert, options);
} 


const updateUserCartQuantity = async ({userId, product}) =>{
    const {productId, quantity}= product
    
    const query = {
        cart_userId: userId,
        'cart_products.productId': productId,
        cart_state: 'active'
    }
    const updateSet= {
        $inc:{
            'cart_products.$.quantity':quantity
        }
    }
    const options = {upsert: true, new: true}

    return await cart.findOneAndUpdate(query, updateSet, options)
}


const findCartById = async (cartId) =>{
    return await cart.findOne({_id: cartId, cart_state:'active'}).lean();
}


module.exports = {
    createUserCart,
    updateUserCartQuantity,
    findCartById

}