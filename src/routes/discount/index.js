const express = require('express');
const router = express.Router();
const discountController = require('../../controllers/discount.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication , authenticationV2} = require('../../auth/authUtils');

router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountWithProducts));

router.use(authenticationV2);

router.post('', asyncHandler(discountController.createDiscount));
router.get('', asyncHandler(discountController.getAllDiscountCode))
module.exports = router;