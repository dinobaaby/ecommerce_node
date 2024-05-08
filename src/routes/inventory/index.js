

const express = require('express')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication , authenticationV2} = require('../../auth/authUtils');
const InventoryController = require('../../controllers/inventory.controller');
const inventoryController = require('../../controllers/inventory.controller');



router.post('', asyncHandler(inventoryController.addStockToInventory))


module.exports = router