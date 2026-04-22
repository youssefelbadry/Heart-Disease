"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const node_path_1 = __importDefault(require("node:path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_controller_1 = __importDefault(require("./Modules/Auth/auth.controller"));
const medicalRecord_controller_1 = __importDefault(require("./Modules/MedicalRecord/medicalRecord.controller"));
const echoVideos_controller_1 = __importDefault(require("./Modules/EchoVideos/echoVideos.controller"));
const error_res_1 = require("./Utils/Responsive/error.res");
const modelResult_controller_1 = __importDefault(require("./Modules/ModelResult/modelResult.controller"));
(0, dotenv_1.config)({ path: node_path_1.default.resolve("./config/.env.dev") });
const bootstrab = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    app.use(express_1.default.json());
    app.use((0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        limit: 100,
    }));
    app.use("/api/v1/auth", auth_controller_1.default);
    app.use("/api/v1/medical", medicalRecord_controller_1.default);
    app.use("/api/v1/echo", echoVideos_controller_1.default);
    app.use("/api/v1/result", modelResult_controller_1.default);
    app.use((_req, res) => {
        res.status(404).json({ message: "Not found endpoint" });
    });
    app.use(error_res_1.globalErrorHandling);
    return app;
};
exports.default = bootstrab;
