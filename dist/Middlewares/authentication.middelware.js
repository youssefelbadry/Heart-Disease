"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const token_1 = require("../Utils/Security/token");
const error_res_1 = require("../Utils/Responsive/error.res");
const authenticate = (req, _res, next) => {
    const auth = req.headers.authorization;
    if (!auth)
        throw new error_res_1.BadRequestException("Missing token");
    const [Beerar, token] = auth.split(" ");
    if (!token || Beerar !== "Bearer")
        throw new error_res_1.BadRequestException("Invalid token");
    try {
        const decoded = (0, token_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch {
        throw new error_res_1.UnauthorizedException("Invalid token");
    }
};
exports.authenticate = authenticate;
