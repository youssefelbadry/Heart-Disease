"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const validation_middlware_1 = require("../../Middlewares/validation.middlware");
const auth_validation_1 = require("./auth.validation");
const authentication_middelware_1 = require("../../Middlewares/authentication.middelware");
const router = (0, express_1.Router)();
router.post("/signup", (0, validation_middlware_1.validation)(auth_validation_1.signUpSchema), auth_service_1.default.signup);
router.post("/forgetPassword", (0, validation_middlware_1.validation)(auth_validation_1.forgetPasswordSchema), auth_service_1.default.forgetPassword);
router.patch("/resetPassword", authentication_middelware_1.authenticate, (0, validation_middlware_1.validation)(auth_validation_1.resetPasswordSchema), auth_service_1.default.resetPassword);
router.post("/login", (0, validation_middlware_1.validation)(auth_validation_1.loginSchema), auth_service_1.default.login);
router.post("/logout", authentication_middelware_1.authenticate, auth_service_1.default.logout);
exports.default = router;
