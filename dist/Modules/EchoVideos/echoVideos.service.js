"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const echoVideo_repository_1 = __importDefault(require("../../DB/Repository/echoVideo.repository"));
const error_res_1 = require("../../Utils/Responsive/error.res");
class EchoVideoService {
    constructor() { }
    createEchoVideo = async (req, res) => {
        if (!req.user?.id) {
            throw new error_res_1.UnauthorizedException("Unauthorized");
        }
        if (!req.file) {
            throw new error_res_1.BadRequestException("No file uploaded");
        }
        if (!req.file.mimetype.startsWith("video/")) {
            throw new error_res_1.BadRequestException("Uploaded file must be a video");
        }
        if (!req.uploadedFilePath) {
            throw new error_res_1.BadRequestException("File path not generated");
        }
        const data = {
            patient_id: req.user.id,
            ...req.body,
            file_url: req.uploadedFilePath,
            video_format: req.file.mimetype,
        };
        const videoId = await echoVideo_repository_1.default.create(data);
        return res.status(201).json({
            message: "Echo video created",
            data: {
                id: videoId,
                ...data,
            },
        });
    };
    getEchoVideo = async (req, res) => {
        const video_id = Number(req.params.id);
        if (isNaN(video_id)) {
            throw new error_res_1.BadRequestException("Invalid video id");
        }
        const record = await echoVideo_repository_1.default.findById(video_id, req.user.id);
        if (!record) {
            throw new error_res_1.NotFoundException("Echo video not found");
        }
        return res.status(200).json({
            message: "Echo video retrieved",
            data: record,
        });
    };
}
exports.default = new EchoVideoService();
