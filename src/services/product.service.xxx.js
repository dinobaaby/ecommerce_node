'use strict';




const {product, electronic, clothing, furniture} = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
const {
     findAllDraftsForShop,
      publishProductByShop ,
      findAllPublishForShop,
      unPublishProductByShop,
      searchProducts
    } = require('../models/repositories/product.repo');


// define Factory class to create product

class ProductFactory{
    /*
        type: 'Clothings'
        payload
    
    */ 

    static productRegistry = {} // key-class


    static registerProductType(type, classRef){
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type, payload){

        const productClass = ProductFactory.productRegistry[type];
        if(!productClass) throw new BadRequestError(`Invalid product Types ${type}`);
        return new productClass(payload).createProduct();
    }


    // Put //
    static async publishProductByShop({product_shop, product_id}){
        return await publishProductByShop({product_shop, product_id});
    }

    static async unPublishProductByShop({product_shop, product_id}){
        return await unPublishProductByShop({product_shop, product_id});
    }
    // end put //


    // query ///
    static async findAllDraftsForShop({product_shop, limit = 50, skip= 0}){
        const query = {product_shop, isDraft: true};
        return await findAllDraftsForShop({query, limit, skip})
    }


    // query ///
    static async findAllPublishForShop({product_shop, limit = 50, skip= 0}){
        const query = {product_shop, isPublished: true};
        return await findAllPublishForShop({query, limit, skip})
    }


    static async searchProducts ({keySearch}){
        return await searchProducts({keySearch})
    }


}


// define base product class

class Product{
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_shop,
        product_type,
        product_attributes
    }){
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_shop = product_shop;
        this.product_type = product_type;
        this.product_attributes = product_attributes;
    }

    // create new product
    async createProduct(product_id){
        return await product.create({
            ...this,
            _id: product_id
        })
    }
}

// define sub-class for different product types clothing
class Clothing extends Product{

    async createProduct(){
        const newClothing = await clothing.create(this.product_attributes);
        if(!newClothing) throw new BadRequestError('Create a new clothing error')
        console.log("Clothing: " + newProduct);
        const newProduct = await super.createProduct();
        if(!newProduct) throw new BadRequestError("Create a new product error");

        return newProduct;
    }

    
}
// define sub-class for different product types electronics
class Electronics extends Product{
    
    async createProduct(){ 
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if(!newElectronic) throw new BadRequestError('Create a new electronic error')
        
        const newProduct = await super.createProduct(newElectronic._id);
        console.log("Electronic: " + newProduct);
        if(!newProduct) throw new BadRequestError("Create a new product error");

        return newProduct;
    }
}

class Furnitures extends Product{
    
    async createProduct(){ 
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if(!newFurniture) throw new BadRequestError('Create a new furniture error')
        
        const newProduct = await super.createProduct(newFurniture._id);
        console.log("Electronic: " + newProduct);
        if(!newProduct) throw new BadRequestError("Create a new product error");

        return newProduct;
    }
}

// register productType 
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furnitures);

module.exports = ProductFactory