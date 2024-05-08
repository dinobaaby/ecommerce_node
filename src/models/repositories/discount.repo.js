const { default: mongoose, models, model } = require("mongoose");

const discount = require("../../models/discount.model");
const { getSelectData, unGetSelectData } = require("../../utils");

const updateDiscount = async ({
    discountId,
    shopId,
    body,
    isNew = true
}) =>{
    return await discount.findByIdAndUpdate({
        _id: discountId,
        discount_shopId: shopId,
        body,
       
    },{
        new: isNew,
    });
}




const findAllDiscountCodeUnSelect = async({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter,
    unSelect,
    model
}) =>{
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? {_id: -1} : {_id: 1};
    const documents  = await model.find(filter)
                        .sort(sortBy)
                        .skip(skip)
                        .limit(limit)
                        .select(unGetSelectData(unSelect))
                        .lean();

    return documents;

}


const findAllDiscountCodeSelect = async({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter,
    select,
    model
}) =>{
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? {_id: -1} : {_id: 1};
    const documents  = await model.find(filter)
                        .sort(sortBy)
                        .skip(skip)
                        .limit(limit)
                        .select(getSelectData(select))
                        .lean();

    return documents;

}

const checkDiscountExits = async ({model, filter}) =>{
    const foundDiscount = await model.findOne(filter).lean();

    return foundDiscount
}



module.exports ={
    updateDiscount,
    findAllDiscountCodeUnSelect,
    findAllDiscountCodeSelect,
    checkDiscountExits
}