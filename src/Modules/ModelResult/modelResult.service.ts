import { Request, Response } from "express";
import ModelResultRepository from "../../DB/Repository/modelResult.repository";
import { ICreateModelResultDTO } from "./modelResult.dto";
import { NotFoundException } from "../../Utils/Responsive/error.res";
import MedicalRecordRepository from "../../DB/Repository/medicalRecord.repository";
import EchoVideoRepository from "../../DB/Repository/echoVideo.repository";
import { ForbiddenException } from "../../Utils/Responsive/error.res";
class ModelResultService {
  createModelResult = async (req: Request, res: Response): Promise<Response> => {
    const {
      medical_record_id,
      echo_video_id,
      cvd_risk_score,
      heart_failure_chance,
      model_metadata,
    } = req.body;

    const medicalRecord = await MedicalRecordRepository.findById(
      medical_record_id, req.user?.id
    );
    if (!medicalRecord) {
      throw new NotFoundException("Medical record not found"); 
    }

    const echoVideo = await EchoVideoRepository.findById(echo_video_id, req.user?.id);
    if (!echoVideo) {
      throw new NotFoundException("Echo video not found");
    }

    if (medicalRecord.patient_id !== echoVideo.patient_id) {
      throw new ForbiddenException(
        "Medical record and echo video do not belong to the same patient"
      );
    }

    const patient_id = medicalRecord.patient_id;

    const resultId = await ModelResultRepository.create({
      patient_id,
      medical_record_id,
      echo_video_id,
      cvd_risk_score,
      heart_failure_chance,
      model_metadata,
    });

    return res.status(201).json({
      message: "Model result created",
      data: {
        id: resultId,
        patient_id,
        medical_record_id,
        echo_video_id,
        cvd_risk_score,
        heart_failure_chance,
      },
    });
  };

  getByMedicalRecord = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const medicalRecordId = Number(req.params.id);

  const medicalRecord = await MedicalRecordRepository.findById(
    medicalRecordId,
    req.user?.id
  );

  if (!medicalRecord) {
    throw new NotFoundException("Medical record not found");
  }

  const results =
    await ModelResultRepository.findByMedicalRecordId(medicalRecordId);

  return res.status(200).json({
    message: "Model results retrieved",
    data: results,
  });
};

}

export default new ModelResultService();
