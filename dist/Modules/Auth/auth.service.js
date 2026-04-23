"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patient_repository_1 = __importDefault(require("../../DB/Repository/patient.repository"));
const hash_1 = require("../../Utils/Security/hash");
const token_1 = require("../../Utils/Security/token");
const generateOtp_1 = require("../../Utils/Security/generateOtp");
const error_res_1 = require("../../Utils/Responsive/error.res");
class AuthService {
    signup = async (req, res) => {
        const { name, email, password } = req.body;
        const exists = await patient_repository_1.default.findByEmail(email);
        if (exists)
            throw new error_res_1.ConflictException("Email already exists");
        await patient_repository_1.default.create({
            name,
            email,
            password: await (0, hash_1.generateHash)(password),
        });
        generateOtp_1.emailService.sendWelcomeEmail(email, name);
        res.status(201).json({
            message: "User created successfully",
        });
    };
    login = async (req, res) => {
        const { email, password } = req.body;
        const patient = await patient_repository_1.default.findByEmail(email);
        if (!patient)
            throw new error_res_1.NotFoundException("Email not found");
        const match = await (0, hash_1.compareHash)(password, patient.password);
        if (!match)
            throw new error_res_1.BadRequestException("Invalid credentials");
        const token = (0, token_1.signToken)({
            id: patient.id,
            email: patient.email,
        });
        await patient_repository_1.default.updateById(patient.id, {
            logged_out_at: null,
        });
        res.status(200).json({ message: "Login successful", access_token: token });
    };
    forgetPassword = async (req, res) => {
        const { email } = req.body;
        const patient = await patient_repository_1.default.findByEmail(email);
        if (!patient)
            throw new error_res_1.NotFoundException("User not found");
        res.json({ message: "go to reset password page" });
    };
    resetPassword = async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        const user = await patient_repository_1.default.findByEmail(req.user.email);
        if (!user)
            throw new error_res_1.NotFoundException("User not found");
        if (!(await (0, hash_1.compareHash)(oldPassword, user.password))) {
            throw new error_res_1.BadRequestException("Invalid old password");
        }
        if (oldPassword === newPassword) {
            throw new error_res_1.BadRequestException("New password must be different from old password");
        }
        await patient_repository_1.default.updateById(user.id, {
            password: await (0, hash_1.generateHash)(newPassword),
        });
        res.json({ message: "password reset successfully" });
    };
    logout = async (req, res) => {
        if (!req.user?.id) {
            throw new error_res_1.BadRequestException("Invalid token payload");
        }
        await patient_repository_1.default.updateById(req.user.id, {
            logged_out_at: new Date(),
        });
        return res.status(200).json({
            message: "Logged out successfully",
        });
    };
}
exports.default = new AuthService();
