'use strict';

const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.service.xxx')
class ProductController {
    createProduct = async (req, res, next) => {

        //v1 Service Product
        // return res.status(200).json({
        //     message: 'Create Product Success',
        //     metadata: await ProductService.createProduct(req.body.product_type, {
        //         ...req.body,
        //         product_shop: req.user.userId
        //     })
        // })

        //v2 Service Product
        return res.status(200).json({
            message: 'Create Product Success',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        })
    }

    publishProductByShop = async(req, res, next) =>{
        return res.status(201).json({
            message: 'Publish Product Success',
            matedata: await ProductServiceV2.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
                
            })
        })
    }


    unPublishProductByShop = async(req, res, next) =>{
        return res.status(201).json({
            message: 'unPublish Product Success',
            matedata: await ProductServiceV2.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
                
            })
        })
    }


    

    // Query //
    /**
     * @description get all draft for shop
     * @param {Number} limit 
     * @param {Number} skip
     * @returns {JSON}
     */
    getAllDraftsForShop = async (req, res, next) => {
        return res.status(200).json({
            message: "Get all draft product successfully",
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        });
    }



    getAllPublishForShop = async (req, res, next) => {
        return res.status(200).json({
            message: "Get all publish product successfully",
            metadata: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId
            })
        });
    }



    getListSearchProducts = async (req, res, next) => {
        return res.status(200).json({
            message: "Get List product successfully",
            metadata: await ProductServiceV2.searchProducts(req.params)
        });
    }
    // End Query //

    

}

module.exports = new ProductController();