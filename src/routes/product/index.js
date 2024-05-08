"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtils");

router.get(
    "/search/:keySearch",
    asyncHandler(productController.getListSearchProducts)
);
router.get("", asyncHandler(productController.findAllProducts));

router.get("/:product_id", asyncHandler(productController.findProduct));

router.use(authenticationV2);

router.post("", asyncHandler(productController.createProduct));
router.patch("/:productId", asyncHandler(productController.updateProduct));
router.post(
    "/publish/:id",
    asyncHandler(productController.publishProductByShop)
);
router.post(
    "/unpublish/:id",
    asyncHandler(productController.unPublishProductByShop)
);

// Query //
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
    "/published/all",
    asyncHandler(productController.getAllPublishForShop)
);

module.exports = router;
