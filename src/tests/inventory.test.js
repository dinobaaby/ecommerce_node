const redisPubSubService = require("../services/redisPubsub.service");

class InventoryServiceTest {
    constructor() {
        redisPubSubService.subscribe("order", (channel, message) => {
            InventoryServiceTest.updateInventory(message);
        });
    }

    static updateInventory(productId, quantity) {
        console.log(`Update inventory ${productId} with quantity ${quantity}`);
    }
}

module.exports = new InventoryServiceTest();
