'use strict';

const {Schema, model} = require('mongoose'); // Erase if already required'
const  slugify  = require('slugify');
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'


const productSchema = new Schema({
    product_name:{type: String, required: true},
    product_thumb:{type: String, required: true},
    product_description:String,
    product_slug: String,
    product_price:{type: Number, required: true},
    product_quantity:{type: Number, required: true},
    product_type:{type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture']},
    product_shop:{type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes:{type:Schema.Types.Mixed, required: true},

    // more 
    product_ratingsAverage:{
        type: Number, 
        default: 4.5,
        min: [1, 'Rating must be above '],
        max: [5, 'Rating must be above 5'],
        set: (val) => Math.round(val * 10)/10
    },
    product_variations: {
        type: Array,
        default: []
    },
    isDraft: {type: Boolean, default: true, index: true, select: false},
    isPublished: {type: Boolean, default: false, index: true, select: false},
},{
    collection: COLLECTION_NAME,
    timestamps: true
})
// create index for search
productSchema.index({product_name: 'text', product_description: 'text'})
// Document Middleware: runs before .save and .create

productSchema.pre('save', function(next){
    this.product_slug = slugify(this.product_name, {lower: true});
    next();

});

//define the product type == clothing

const clothingSchema = new Schema({
    brand:{type:String, require: true},
    size:String,
    material:String,
    product_shop: {type:Schema.Types.ObjectId, ref: 'Shop'}
},{
    collection: 'clothes',
    timestamps: true
}) 

//define the product type == Electronics

const electronicSchema = new Schema({
    manufacturer:{type:String, require: true},
    model:String,
    color:String,
    product_shop: {type:Schema.Types.ObjectId, ref: 'Shop'}
},{
    collection: 'electronics',
    timestamps: true
}) ;



// define sub-class for different product type = furnitures
const furnitureSchema  = new Schema({
    brand: { type: String, required: true},
    size: String,
    material: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    }
}, {
    collection: 'Furnitures',
    timestamps: true
});

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic : model('Electronics', electronicSchema),
    furniture: model('Furniture', furnitureSchema)
}