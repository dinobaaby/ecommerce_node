'use strict';

const {Schema, model} = require('mongoose')

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'


const inventorySchema = new Schema({
    inven_productId: {type: Schema.Types.ObjectId, ref: 'Product'},
    inven_lacation: {type:String, default: "unKnow"},
    inven_stock: {type:Number, required: true},
    inven_shopId: {type: Schema.Types.ObjectId, ref: 'Shhop'},
    inven_reservations: {type:Array, default: []}
   
},{
    timestamps: true,
    collection:COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, inventorySchema);