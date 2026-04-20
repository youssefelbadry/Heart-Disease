import { Request, Response } from "express";
import MedicalRecordRepository from "../../DB/Repository/medicalRecord.repository";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../../Utils/Responsive/error.res";

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

    return res.status(201).json({
      message: "Medical record created",
      data: {
        id: recordId,
        ...data,
      },
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
