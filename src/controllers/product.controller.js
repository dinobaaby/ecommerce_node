'use strict';

const ProductService = require('../services/product.service')

class ProductController {
    createProduct = async (req, res, next) => {
        return res.status(200).json({
            message: 'Create Product Success',
            metadata: await ProductService.createProduct(req.body.product_type, req.body)
        })
    }

    

}

module.exports = new ProductController();