const { OK } = require("../core/success.response")
const DiscountService = require("../services/discount.service")



class DiscountController {


    createDiscount = async(req, res, next) =>{
        OK(
            res,
            "Create Discount success",
            await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        );
    }

    getAllDiscountCode =  async(req, res, next) =>{
        OK(
            res,
            "Get all Discount success",
            await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                shopId: req.user.userId
            })
        );
    }

    getDiscountAmount =  async(req, res, next) =>{
        OK(
            res,
            " Discount amount success",
            await DiscountService.getDiscountAmount({
                ...req.body,
                shopId: req.user.userId
            })
        );
    }

    getAllDiscountWithProducts =  async(req, res, next) =>{
        OK(
            res,
            "Get all  Discount product success",
            await DiscountService.getAllDiscountCodesWithProducts({
                ...req.query,
                //shopId: req.user.userId
            })
        );
       
    }


   
}


module.exports = new DiscountController();