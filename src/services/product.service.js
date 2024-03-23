'use strict';



const {product, electronic, clothing} = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');


// define Factory class to create product

class ProductFactory{
    /*
        type: 'Clothings'
        payload
    
    */ 
    static async createProduct(type, payload){
        switch(type){
            case 'Electronics':
                return new Electronics(payload).createProduct();
            case 'Clothing':
                return new Clothing(payload).createProduct();
            default:
                throw new BadRequestError(`Invalid product type ${type}`);

        }
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
    async createProduct(){
        return await product.create(this)
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
        const newElectronic = await electronic.create(this.product_attributes);
        if(!newElectronic) throw new BadRequestError('Create a new electronic error')
        
        const newProduct = await super.createProduct();
        console.log("Electronic: " + newProduct);
        if(!newProduct) throw new BadRequestError("Create a new product error");

        return newProduct;
    }
}


module.exports = ProductFactory