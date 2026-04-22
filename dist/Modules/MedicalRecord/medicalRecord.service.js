"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const medicalRecord_repository_1 = __importDefault(require("../../DB/Repository/medicalRecord.repository"));
const error_res_1 = require("../../Utils/Responsive/error.res");
class MedicalRecordService {
    constructor() { }
    createMedicalRecord = async (req, res) => {
        if (!req.user?.id) {
            throw new error_res_1.UnauthorizedException("Unauthorized");
        }
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new error_res_1.BadRequestException("Medical record data is required");
        }
        const data = {
            patient_id: req.user.id,
            ...req.body,
        };
        const recordId = await medicalRecord_repository_1.default.create(data);
        return res.status(201).json({
            message: "Medical record created",
            data: {
                id: recordId,
                ...data,
            },
        });
    };
    getMedicalRecord = async (req, res) => {
        if (!req.user?.id) {
            throw new error_res_1.UnauthorizedException("Unauthorized");
        }
        const record_id = Number(req.params.id);
        if (!Number.isInteger(record_id) || record_id <= 0) {
            throw new error_res_1.BadRequestException("Invalid record id");
        }
        const record = await medicalRecord_repository_1.default.findById(record_id, req.user.id);
        if (!record) {
            throw new error_res_1.NotFoundException("Medical record not found");
        }
        return res.status(200).json({
            message: "Medical record retrieved",
            data: record,
        });
    };
}
exports.default = new MedicalRecordService();
