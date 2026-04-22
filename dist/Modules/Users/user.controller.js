"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = __importDefault(require("./user.service"));
const authentication_middelware_1 = require("../../Middlewares/authentication.middelware");
const token_1 = require("../../Utils/Security/token");
const user_model_1 = require("../../DB/Models/user.model");
const cloud_multer_1 = require("../../Utils/Multer/cloud.multer");
const authentication = new authentication_middelware_1.AuthenticationMiddleware();
const router = (0, express_1.Router)();
router.get("/getProfile", authentication.authenticate(token_1.TokenTypeEnum.ACCESS, [user_model_1.Role.USER]), user_service_1.default.getProfile);
router.patch("/profileImage", authentication.authenticate(token_1.TokenTypeEnum.ACCESS, [user_model_1.Role.USER]), (0, cloud_multer_1.cloufFileUploud)({
    validation: [...cloud_multer_1.filterFile.image],
    storgeApproch: cloud_multer_1.storgeFilter.MEMORY,
    maxSizeMB: 2,
}).single("attachment"), user_service_1.default.profileImage);
router.patch("/coverImage", authentication.authenticate(token_1.TokenTypeEnum.ACCESS, [user_model_1.Role.USER]), (0, cloud_multer_1.cloufFileUploud)({
    validation: [...cloud_multer_1.filterFile.image],
    storgeApproch: cloud_multer_1.storgeFilter.MEMORY,
    maxSizeMB: 2,
}).single("attachment"), user_service_1.default.coverImage);
exports.default = router;
