"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_controller_1 = __importDefault(require("./app.controller"));
const app = (0, app_controller_1.default)();
if (require.main === module && process.env.VERCEL !== "1") {
    const port = Number(process.env.PORT) || 5000;
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}
exports.default = app;
