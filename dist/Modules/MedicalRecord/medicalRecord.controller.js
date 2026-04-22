"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medicalRecord_service_1 = __importDefault(require("./medicalRecord.service"));
const validation_middlware_1 = require("../../Middlewares/validation.middlware");
const authentication_middelware_1 = require("../../Middlewares/authentication.middelware");
const medicalRecord_validation_1 = require("./medicalRecord.validation");
const router = (0, express_1.Router)();
router.post("/createMedicalRecord", authentication_middelware_1.authenticate, (0, validation_middlware_1.validation)(medicalRecord_validation_1.createMedicalRecordSchema), medicalRecord_service_1.default.createMedicalRecord);
router.get("/getMedicalRecord/:id", authentication_middelware_1.authenticate, medicalRecord_service_1.default.getMedicalRecord);
exports.default = router;
