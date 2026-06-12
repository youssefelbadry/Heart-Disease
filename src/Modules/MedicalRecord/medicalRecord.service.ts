import { Request, Response } from "express";
import MedicalRecordRepository from "../../DB/Repository/medicalRecord.repository";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../../Utils/Responsive/error.res";
import { predictClinical } from "../../Services/ai/ai.service";
import modelResultRepository from "../../DB/Repository/modelResult.repository";
import { tryRunGlobalPrediction } from "../../Services/result/createGlobalPrediction";
class MedicalRecordService {
  constructor() {}

  createMedicalRecord = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    if (!req.user?.id) {
      throw new UnauthorizedException("Unauthorized");
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      throw new BadRequestException("Medical record data is required");
    }

    const data = {
      patient_id: req.user.id,
      ...req.body,
    };

    const recordId = await MedicalRecordRepository.create(data);

    // Call AI service to get prediction

    const aiResult = await predictClinical({
      male: data.male,
      age: data.age,
      currentSmoker: data.currentSmoker,
      BPMeds: data.BPMeds,
      prevalentHyp: data.prevalentHyp,
      diabetes: data.diabetes,
      sysBP: data.sysBP,
      diaBP: data.diaBP,
    });

    const incompleteResult = await modelResultRepository.findIncompleteResult(
      req.user.id,
    );

    if (incompleteResult) {
      await modelResultRepository.update(
        {
          patient_id: req.user.id,
        },

        {
          medical_record_id: recordId,

          cvd_risk_score: aiResult.clinical_score,
        },
      );
    } else {
      await modelResultRepository.create({
        patient_id: req.user.id,

        medical_record_id: recordId,

        cvd_risk_score: aiResult.clinical_score,
      });
    }
    tryRunGlobalPrediction(req.user.id).catch((error) => {
      console.error("Global prediction failed:", error);
    });
    return res.status(201).json({
      message: "Medical record created",

      medical_record: {
        id: recordId,
        ...data,
        pulse_pressure:
          data.sysBP && data.diaBP ? data.sysBP - data.diaBP : null,
      },

      cvd_risk_score: aiResult.clinical_score,
    });
  };

  getMedicalRecord = async (req: Request, res: Response): Promise<Response> => {
    if (!req.user?.id) {
      throw new UnauthorizedException("Unauthorized");
    }

    const record_id = Number(req.params.id);
    if (!Number.isInteger(record_id) || record_id <= 0) {
      throw new BadRequestException("Invalid record id");
    }

    const record = await MedicalRecordRepository.findById(
      record_id,
      req.user.id,
    );

    if (!record) {
      throw new NotFoundException("Medical record not found");
    }

    return res.status(200).json({
      message: "Medical record retrieved",
      data: record,
    });
  };
}

export default new MedicalRecordService();
