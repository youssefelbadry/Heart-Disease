"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middlware_1 = require("../../Middlewares/validation.middlware");
const modelResult_service_1 = __importDefault(require("./modelResult.service"));
const modelResult_validation_1 = require("./modelResult.validation");
const authentication_middelware_1 = require("../../Middlewares/authentication.middelware");
const router = (0, express_1.Router)();
router.post("/createModelResult", authentication_middelware_1.authenticate, (0, validation_middlware_1.validation)(modelResult_validation_1.createModelResultSchema), modelResult_service_1.default.createModelResult);
router.get("/getByMedicalRecord/:id", authentication_middelware_1.authenticate, modelResult_service_1.default.getByMedicalRecord);
exports.default = router;
