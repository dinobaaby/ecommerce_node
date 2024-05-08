'use strict'

const { default: mongoose } = require("mongoose")



const DOCUMENT_NAME = 'Cart'

const COLLECTION_NAME = 'Carts'


const cartScheme = new mongoose.Schema({
    cart_state:{
        type: String,
        required: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    },
    cart_products:{
        type:Array,
        required: true,
        default:[]
    },

    /*
        {
            product_id,
            shop_id
            quantity
            name
            price
        }
    */

    cart_count_products:{
        type:Number,
        default:0
    },
    cart_userId:{
        type:Number,
        required: true

    }

},{
    collection: COLLECTION_NAME,
    timestamps:{
        createdAt: 'createdOn',
        updatedAt: 'modifedOn'
    }
})


module.exports = {
    cart: mongoose.model(DOCUMENT_NAME, cartScheme)
}