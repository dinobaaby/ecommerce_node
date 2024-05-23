"use strict";

const cloudinary = require("../configs/cloudinary.config");
const {
    s3,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} = require("../configs/s3.config");

const { randomImageName } = require("../utils/index");
//const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const {
    getSignedUrl,
    getSignedCookies,
} = require("@aws-sdk/cloudfront-signer");
const urlImagePublic = "https://d3hcq5nokx6dq7.cloudfront.net";
/// Upload file using amazon web service s3 ///
const uploadImageFromLocalS3 = async ({ file }) => {
    try {
        const imageName = randomImageName();
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName || "unknown",
            Body: file.buffer,
            ContentType: "image/jpeg",
        });

        // export url

        const result = await s3.send(command);
        console.log(result);

        // const singedUrl = new GetObjectCommand({
        //     Bucket: process.env.AWS_BUCKET_NAME,
        //     Key: imageName,
        // });
        //const url = await getSignedUrl(s3, singedUrl, { expiresIn: 3600 });

        // have cloudfront url export

        const url = getSignedUrl({
            url: ` ${urlImagePublic}/${imageName}`,
            keyPairId: process.env.CLOUD_FRONT_PUBLIC_KEY,
            dateLessThan: new Date(Date.now() + 60 * 1000),
            privateKey: process.env.CLOUD_FRONT_PRIVATE_KEY,
        });

        return {
            url,
            result,
        };
    } catch (err) {
        console.log(`Upload image from local error using s3client: ${err}`);
    }
};

const getImageUrlFromS3 = async ({ url }) => {
    try {
        const cookies = getSignedUrl({
            url,
            keyPairId: process.env.CLOUD_FRONT_PUBLIC_KEY,
            dateLessThan: new Date(Date.now() + 60 * 1000),
            privateKey: process.env.CLOUD_FRONT_PRIVATE_KEY,
        });

        return cookies;
    } catch (err) {
        console.log(`Error getting image from S3: ${err}`);
    }
};

/// End upload file using amazon web service s3 ///
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

const uploadImageFromLocal = async ({ path, folderName = "product/8409" }) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            folder: folderName,
        });
        console.log(result);

        return {
            iamge_url: result.secure_url,
            shopId: 8409,
            thumb_url: await cloudinary.url(result.public_id, {
                height: 250,
                width: 200,
                format: "jpg",
            }),
        };
    } catch (err) {
        console.log(`Upload image from local error: ${err}`);
    }
};

const uploadImageFromLocalFiles = async ({
    files,
    folderName = "product/8409",
}) => {
    try {
        console.log(`file: ${files} folderName: ${folderName}`);
        if (!files.length) {
            return;
        }
        const uploadUrls = [];
        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: folderName,
            });

            uploadUrls.push({
                iamge_url: result.secure_url,
                shopId: 8409,
                thumb_url: await cloudinary.url(result.public_id, {
                    height: 250,
                    width: 200,
                    format: "jpg",
                }),
            });
        }

        return uploadUrls;
    } catch (err) {
        console.log(`Upload image from local files error: ${err}`);
    }
};
module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalFiles,
    uploadImageFromLocalS3,
    getImageUrlFromS3,
};
