"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const modelResult_repository_1 = __importDefault(require("../../DB/Repository/modelResult.repository"));
const error_res_1 = require("../../Utils/Responsive/error.res");
const medicalRecord_repository_1 = __importDefault(require("../../DB/Repository/medicalRecord.repository"));
const echoVideo_repository_1 = __importDefault(require("../../DB/Repository/echoVideo.repository"));
const error_res_2 = require("../../Utils/Responsive/error.res");
class ModelResultService {
    createModelResult = async (req, res) => {
        const { medical_record_id, echo_video_id, cvd_risk_score, heart_failure_chance, model_metadata, } = req.body;
        const medicalRecord = await medicalRecord_repository_1.default.findById(medical_record_id, req.user?.id);
        if (!medicalRecord) {
            throw new error_res_1.NotFoundException("Medical record not found");
        }
        const echoVideo = await echoVideo_repository_1.default.findById(echo_video_id, req.user?.id);
        if (!echoVideo) {
            throw new error_res_1.NotFoundException("Echo video not found");
        }
        if (medicalRecord.patient_id !== echoVideo.patient_id) {
            throw new error_res_2.ForbiddenException("Medical record and echo video do not belong to the same patient");
        }
        const patient_id = medicalRecord.patient_id;
        const resultId = await modelResult_repository_1.default.create({
            patient_id,
            medical_record_id,
            echo_video_id,
            cvd_risk_score,
            heart_failure_chance,
            model_metadata,
        });
        if (!resultId) {
            throw new Error("Failed to create model result");
        }
        return res.status(201).json({
            message: "Model result created",
            data: {
                id: resultId,
                patient_id,
                medical_record_id,
                echo_video_id,
                cvd_risk_score,
                heart_failure_chance,
                model_metadata,
            },
        });
    };
    getByMedicalRecord = async (req, res) => {
        const medicalRecordId = Number(req.params.id);
        const medicalRecord = await medicalRecord_repository_1.default.findById(medicalRecordId, req.user?.id);
        if (!medicalRecord) {
            throw new error_res_1.NotFoundException("Medical record not found");
        }
        const results = await modelResult_repository_1.default.findByMedicalRecordId(medicalRecordId);
        return res.status(200).json({
            message: "Model results retrieved",
            data: results,
        });
    };
}
exports.default = new ModelResultService();
