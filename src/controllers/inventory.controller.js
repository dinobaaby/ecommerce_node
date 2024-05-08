'use strict'


const InventoryService = require("../services/inventory.service")
const {OK} = require('../core/success.response')

class InventoryController{

    addStockToInventory = async(req, res, next) =>{
        OK(
            res,
            "Creae inventory success",
            await InventoryService.addStockToInventory(req.body)
        )
    }

}


module.exports = new InventoryController()