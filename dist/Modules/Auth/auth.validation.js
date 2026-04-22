"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOutSchema = exports.resetPasswordSchema = exports.forgetPasswordSchema = exports.signUpSchema = exports.loginSchema = void 0;
const z = __importStar(require("zod"));
const validation_middlware_1 = require("../../Middlewares/validation.middlware");
exports.loginSchema = {
    body: z.strictObject({
        email: validation_middlware_1.generaFeild.email,
        password: validation_middlware_1.generaFeild.password,
    }),
};
exports.signUpSchema = {
    body: exports.loginSchema.body
        .extend({
        name: validation_middlware_1.generaFeild.name,
        confirmPassword: validation_middlware_1.generaFeild.confirmPassword,
    })
        .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["confirmPassword"],
                message: "Passwords do not match",
            });
        }
        if (data.name.split(" ").length !== 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["name"],
                message: "Name must be 2 words",
            });
        }
    }),
};
exports.forgetPasswordSchema = {
    body: z.strictObject({
        email: validation_middlware_1.generaFeild.email,
    }),
};
exports.resetPasswordSchema = {
    body: z
        .strictObject({
        oldPassword: validation_middlware_1.generaFeild.password,
        newPassword: validation_middlware_1.generaFeild.password,
    })
        .superRefine((data, ctx) => {
        if (data.oldPassword === data.newPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["newPassword"],
                message: "New password must be different from old password",
            });
        }
    }),
};
exports.logOutSchema = {
    body: z.strictObject({
        email: validation_middlware_1.generaFeild.email,
    }),
};
