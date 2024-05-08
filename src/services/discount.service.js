"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");

const discount = require("../models/discount.model");
const { convertToObjectIdMongodb } = require("../utils");
const { findAllProducts } = require("../models/repositories/product.repo.js");
const { product } = require("../models/product.model");
const {
  findAllDiscountCodeUnSelect,
  checkDiscountExits,
} = require("../models/repositories/discount.repo.js");

/*
        Discount Service
        1. Generater discount code SHop | Admin
        2. Get discount amount [User]
        3. Get all discount code
        4. Verify discount amount
        5. Delete discount code [Admin | Shop]
*/

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_day,
      end_day,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      user_used,
    } = payload;
    console.log("Code: " + code);

    // verify
    if (new Date() < new Date(start_day) || new Date() > new Date(end_day)) {
      throw new BadRequestError("Discount code has expried");
    }

    if (new Date(start_day) >= new Date(end_day)) {
      throw new BadRequestError("Start day must be before end day");
    }

    // find discout is exit
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId),
    });

    // ton tai va discount is_Active = true
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount exits");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_discription: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_day),
      discount_end_date: new Date(end_day),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: user_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscount() {}

  /**
                Get all discount codes available with products
         */

  static async getAllDiscountCodesWithProducts({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    console.log(
      `code : ${code}, shopId : ${shopId}, userId : ${userId}, limit : ${limit}, page : ${page}`
    );
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId),
    });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Dicount not exists");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;

    console.log(discount_applies_to);
    let products;
    if (discount_applies_to === "all") {
      // get all products
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      // get the products ids

      products = await findAllProducts({
        filter: {
          _id: {
            $in: discount_product_ids,
          },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    console.log(`Product: ${products}`);

    return products;
  }

  /**
                Get all discount code for shop
         */

  static async getAllDiscountCodeByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodeUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      unSelect: ["_v", "discount_shopId"],
      model: discount,
    });

    return discounts;
  }

  /**
         

                Apply discount code
                products = [
                        {
                                productId,
                                shopId,
                                quantity,
                                name,
                                price
                        }
                ]
         */

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExits({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError("Discount doesn't exist");
    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_name,
      discount_start_date,
      discount_end_date,
      discount_value,
    } = foundDiscount;
    if (!discount_is_active) throw new NotFoundError("Discount expried");
    if (!discount_max_uses) throw new NotFoundError("Discount are out");

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new NotFoundError("Discount day expried");
    }

    // kiem tra xem co yeu cau gia tri toi thieu
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `Dicount require a miniu order value of ${discount_min_order_value}`
        );
      }
    }
    if (discount_max_uses_per_user > 0) {
      const userDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userDiscount) {
      }
    }

    // kiem tra discount la fixed_amount =

    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalOrder: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId),
    });

    return deleted;
  }

  static async cancelDiscountCode({ shopId, codeId, userId }) {
    const foundDiscount = await checkDiscountExits({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError("Discount doesn't exist");

    const resutl = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_uses_count: -1,
        discount_max_uses: 1,
      },
    });

    return resutl;
  }
}

module.exports = DiscountService;
