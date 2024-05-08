const redisPubSubService = require("../services/redisPubsub.service");

class ProductServiceTest {
    purchaseProduct(productId, quantity) {
        const order = {
            productId,
            quantity,
        };

        console.log(`Purchase product ${productId} with quantity ${quantity}`);

        redisPubSubService.publish("order", JSON.stringify(order));
    }
}

module.exports = new ProductServiceTest();
