"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFiles = exports.uploadLargeFile = exports.uploadFile = exports.s3Congig = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const cloud_multer_1 = require("./cloud.multer");
const uuid_1 = require("uuid");
const error_res_1 = require("../Responsive/error.res");
const s3Congig = () => {
    return new client_s3_1.S3Client({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
        },
    });
};
exports.s3Congig = s3Congig;
const uploadFile = async ({ storgeApproch = cloud_multer_1.storgeFilter.MEMORY, Bucket = process.env.BUCKET, ACL = "private", path = "general", file, }) => {
    const commend = new client_s3_1.PutObjectCommand({
        Bucket,
        ACL,
        Key: `${process.env.APP_NAME}/${path}/${(0, uuid_1.v4)()}-${file.originalname}`,
        Body: storgeApproch === cloud_multer_1.storgeFilter.MEMORY ? file.buffer : file.path,
        ContentType: file.mimetype,
    });
    await (0, exports.s3Congig)().send(commend);
    if (!commend?.input?.Key)
        throw new error_res_1.BadRequestException("Faild upload file");
    return commend.input.Key;
};
exports.uploadFile = uploadFile;
const uploadLargeFile = async ({ storgeApproch = cloud_multer_1.storgeFilter.MEMORY, Bucket = process.env.BUCKET, ACL = "private", path = "general", file, }) => {
    const fileKey = `${process.env.APP_NAME}/${path}/${(0, uuid_1.v4)()}-${file.originalname}`;
    const upload = new lib_storage_1.Upload({
        client: (0, exports.s3Congig)(),
        params: {
            Bucket,
            ACL,
            Key: fileKey,
            Body: storgeApproch === cloud_multer_1.storgeFilter.MEMORY ? file.buffer : file.path,
            ContentType: file.mimetype,
        },
        partSize: 500 * 1024 * 1024,
    });
    upload.on("httpUploadProgress", (progress) => {
        console.log(progress);
    });
    await upload.done();
    if (!fileKey)
        throw new error_res_1.BadRequestException("Faild upload file");
    return fileKey;
};
exports.uploadLargeFile = uploadLargeFile;
const uploadFiles = async ({ storgeApproch = cloud_multer_1.storgeFilter.MEMORY, Bucket = process.env.BUCKET, ACL = "private", path = "general", files, }) => {
    let urls = [];
    urls = await Promise.all(files.map((file) => {
        return (0, exports.uploadFile)({
            storgeApproch,
            Bucket: Bucket || process.env.BUCKET || "default-bucket",
            ACL,
            path,
            file,
        });
    }));
};
exports.uploadFiles = uploadFiles;
