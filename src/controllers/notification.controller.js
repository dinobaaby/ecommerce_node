"uses strict";

const { listNotiByUser } = require("../services/notification.service");
const { OK } = require("../core/success.response");

class NotificationController {
    listNotiByUser = async (req, res, next) => {
        OK(
            res,
            "Get list of notification success",
            await listNotiByUser(req.query)
        );
    };
}

module.exports = new NotificationController();
