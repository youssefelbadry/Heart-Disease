"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const echoVideos_service_1 = __importDefault(require("./echoVideos.service"));
const validation_middlware_1 = require("../../Middlewares/validation.middlware");
const authentication_middelware_1 = require("../../Middlewares/authentication.middelware");
const echoVideos_validation_1 = require("./echoVideos.validation");
const local_multer_1 = require("../../Utils/Multer/local.multer");
const router = (0, express_1.Router)();
router.post("/createEchoVideo", authentication_middelware_1.authenticate, (0, local_multer_1.localFileUpload)({ customPath: "echoVideos" }).single("video"), echoVideos_service_1.default.createEchoVideo);
router.get("/getEchoVideo/:id", authentication_middelware_1.authenticate, (0, validation_middlware_1.validation)(echoVideos_validation_1.getEchoVideoSchema), echoVideos_service_1.default.getEchoVideo);
exports.default = router;
