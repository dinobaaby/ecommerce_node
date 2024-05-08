'use strict';


const { getSelectData, unGetSelectData, convertToObjectIdMongodb } = require('../../utils');
const {
        product,
        electronic,
        clothing, 
        furniture,

    } = require('../product.model');
const mongoose = require('mongoose')

const findAllDraftsForShop = async({query, limit, skip}) =>{
    return await queryProduct({query, limit, skip})
}


const publishProductByShop = async({product_shop, product_id}) => {
   
    const product_shop_id = new mongoose.Types.ObjectId(product_shop);
    const product_id_uuid = new mongoose.Types.ObjectId(product_id);
    const foundShop = await product.findOne({
        product_shop:product_shop_id,
        _id: product_id_uuid
    });
    console.log(`Found: ------- ${foundShop}`);

    if(!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublished = true;
    
    const {modifiedCount} = await foundShop.updateOne(foundShop)

    return modifiedCount;
}

const unPublishProductByShop = async ({product_shop, product_id}) =>{
    const product_shop_id = new mongoose.Types.ObjectId(product_shop);
    const product_id_uuid = new mongoose.Types.ObjectId(product_id);
    const foundShop = await product.findOne({
        product_shop:product_shop_id,
        _id: product_id_uuid
    });

    if(!foundShop) return null;
    foundShop.isDraft = true;
    foundShop.isPublished = false;
    const {modifiedCount} = await foundShop.updateOne(foundShop)

    return modifiedCount;
}


const findAllPublishForShop = async({query, limit, skip}) =>{
    return await queryProduct({query, limit, skip})
}


const findProduct = async ({ product_id, unSelect}) =>{
    return await product.findById(product_id).select(unGetSelectData(unSelect));
}

const queryProduct = async({query, limit, skip}) =>{
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({updateAt: -1})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
}

const findAllProducts = async({limit, sort, page, filter, select}) =>{
    const skip =(page - 1) * limit;
    const sortBy = sort === "ctime" ? {_id: -1} : {_id: 1};
    const products = 
            await product.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(getSelectData(select))
            .lean()

    return products;

}

const searchProducts = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const results = await product.find(
        {
            isPublished: true,
            $text: { $search: regexSearch },
        },
        { score: { $meta: "textScore" } } // Đúng cú pháp $meta
    ).sort({ score: { $meta: "textScore" } }).lean();
    return results;
}


const updateproductById = async ({
    productId,
    bodyUpdate,
    model,
    isNew = true
}) =>{
    return await model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew,
        
    })

}

const getProductById = async (productId) =>{
    return await product.findOne({_id: convertToObjectIdMongodb(productId)})
}


const checkProduct = async (products) =>{
    return await Promise.all(
        products.map( async product => {
            const foundProduct = await getProductById(product.productId)
            if (foundProduct) {
                return {
                    price: foundProduct.product_price,
                    quantity: product.quantity,
                    productId: product.productId
                }
            }
        })
    )
}
module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProducts,
    findAllProducts,
    findProduct,
    updateproductById,
    getProductById,
    checkProduct
}
