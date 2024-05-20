"use strict";
const cloudinary = require("../configs/cloudinary.config");
// 1. Upload from url image

const uploadImageFromUrl = async () => {
    try {
        const urlImage =
            "https://scontent.fhan15-1.fna.fbcdn.net/v/t39.30808-6/442502925_778850560893907_7563033360479718496_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeE0G6EFqKeTcWjEUL5lu3Sl6AHAu6wAqn_oAcC7rACqf1r1htlZmoLpxZsicFx3YGj8fk7yVfbk5z7v2jMPLmRz&_nc_ohc=evkuLU1bLNYQ7kNvgFPiZaO&_nc_ht=scontent.fhan15-1.fna&oh=00_AYBVcSXTcmcV91hKS9swnZr4hHf94Uqx7Sv-xw7YZm5rzA&oe=665076DF";
        const folderName = "product/shopID";
        const newFileName = "testdemo";

        const result = await cloudinary.uploader.upload(urlImage, {
            folder: folderName,
        });

        return result;
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    uploadImageFromUrl,
};
