const { mongo } = require("mongoose")
const inventoryModel = require("../inventory.model")
const { convertToObjectIdMongodb } = require("../../utils")
const { create } = require("lodash")



const insertInventory = async({
    productId,
    shopId,
    stock,
    location = 'unKnow'
}) =>{
    return await inventoryModel.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_lacation: location,
        inven_stock: stock
    })
}


const reservationInventory = async ({productId, quantity, cartId}) =>{
    const query= {
        inven_productId: convertToObjectIdMongodb(productId),
        inven_stock:{$gte:quantity}
    }
    const updateSet = {
        $inc:{
            inven_stock: -quantity
        },
        $push:{
            inven_reservations:{
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }
    const options = {
        upsert: true,
        new: true
    }


    return await inventoryModel.updateOne(query, updateSet)
} 


module.exports = {
    insertInventory,
    reservationInventory
}