"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localFileUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const error_res_1 = require("../Responsive/error.res");
const ALLOWED_VIDEO_MIME_TYPES = [
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
    "video/webm",
    "video/mkv",
];
const localFileUpload = ({ customPath = "general", }) => {
    const basePath = `uploads/${customPath}`;
    const storage = multer_1.default.diskStorage({
        destination: (req, _file, cb) => {
            if (!req.user?.id) {
                return cb(new error_res_1.BadRequestException("Unauthorized upload"), "");
            }
            const userBasePath = `${basePath}/${req.user.id}`;
            const fullPath = node_path_1.default.resolve(`./src/${userBasePath}`);
            if (!node_fs_1.default.existsSync(fullPath)) {
                node_fs_1.default.mkdirSync(fullPath, { recursive: true });
            }
            cb(null, fullPath);
        },
        filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${node_path_1.default.extname(file.originalname)}`;
            req.uploadedFilePath = `${basePath}/${req.user.id}-${uniqueName}`;
            cb(null, uniqueName);
        },
    });
    const fileFilter = (req, file, cb) => {
        if (!ALLOWED_VIDEO_MIME_TYPES.includes(file.mimetype)) {
            return cb(new error_res_1.BadRequestException("Invalid file type. Only video files are allowed"));
        }
        cb(null, true);
    };
    return (0, multer_1.default)({
        storage,
        fileFilter,
        limits: {
            fileSize: 500 * 1024 * 1024,
        },
    });
};
exports.localFileUpload = localFileUpload;
