"use strict";

const { cart } = require("../models/cart.model");
const {
  createUserCart,
  updateUserCartQuantity,
} = require("../models/repositories/cart.repo");
const { getProductById } = require("../models/repositories/product.repo");
const { BadRequestError, NotFoundError } = require("../core/error.response");

/**
 *  Key features: Cart Services
 *  1. Add product to cart |user|
 *  2. rudece product quantity by one |user|
 *  3. increase product quantity by one |user|
 *  4. get cart
 *  5. Delete cart
 *  6. Delete cart items
 */

class CartService {
  static async addToCart({ userId, product = {} }) {
    const userCart = await cart.findOne({ cart_userId: userId });

    if (!userCart) {
      // create cart for user

      return await createUserCart({ userId, product });
    }

    // if you have cart but dont not exist product in your cart

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];

      return await userCart.save();
    }

    // if your shopping cart exist and this product ís in your cart, update the quantity product

    return await updateUserCartQuantity({ userId, product });
  }

  //update cart
  /**
        shop_order_ids:[
            {
                shopId,
                item_products:[
                    {
                        quantity,
                        price,
                        shopId,
                        old_quantity,
                        productId
                    }
                ],
                version
            }
        ]
     */

  static async addToCastV2({ userId, shop_order_ids = [] }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    // check product
    console.log({ productId, quantity, old_quantity });

    const foundProduct = await getProductById(productId);

    console.log(`found: ${foundProduct}`);
    if (!foundProduct) throw new NotFoundError("");

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("Product do not belong to the shop");
    }

    if (quantity === 0) {
    }

    const result = await updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });

    return result;
  }

  static async deleteItemInUserCart({ userId, productId }) {
    const query = {
      cart_userId: userId,
      cart_state: "active",
    };
    const updateSet = {
      $pull: {
        cart_products: {
          productId,
        },
      },
    };

    const deleteCart = await cart.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

module.exports = CartService;
