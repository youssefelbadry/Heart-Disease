"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const token_1 = require("../Utils/Security/token");
const error_res_1 = require("../Utils/Responsive/error.res");
const patient_repository_1 = __importDefault(require("../DB/Repository/patient.repository"));
const authenticate = async (req, _res, next) => {
    const auth = req.headers.authorization;
    if (!auth) {
        throw new error_res_1.BadRequestException("Missing token");
    }
    const [bearer, token] = auth.split(" ");
    if (!token || bearer !== "Bearer") {
        throw new error_res_1.BadRequestException("Invalid token format");
    }
    try {
        const decoded = (0, token_1.verifyToken)(token);
        req.user = decoded;
        const patient = await patient_repository_1.default.findById(decoded.id);
        if (!patient) {
            throw new error_res_1.UnauthorizedException("User not found");
        }
        if (patient.logged_out_at && decoded.iat) {
            const tokenIssuedAt = decoded.iat * 1000;
            const logoutAt = new Date(patient.logged_out_at).getTime();
            if (tokenIssuedAt < logoutAt) {
                throw new error_res_1.UnauthorizedException("You are logged out, please login again");
            }
        }
        next();
    }
    catch (err) {
        console.log("Auth Error:", err?.message);
        if (err instanceof error_res_1.UnauthorizedException) {
            throw err;
        }
        if (err.name === "TokenExpiredError") {
            throw new error_res_1.UnauthorizedException("Token expired");
        }
        throw new error_res_1.UnauthorizedException("Invalid token");
    }
};
exports.authenticate = authenticate;
