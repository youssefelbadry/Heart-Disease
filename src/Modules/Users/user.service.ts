import { Request, Response } from "express";
import patientRepo from "../../DB/Repository/patient.repository";
import {
  NotFoundException,
  UnauthorizedException,
} from "../../Utils/Responsive/error.res";
import medicalRecordRepository from "../../DB/Repository/medicalRecord.repository";
import modelResultRepository from "../../DB/Repository/modelResult.repository";

class UserService {
  constructor(
    private readonly _medicalRecordRepository: typeof medicalRecordRepository,
    private readonly _modelResultRepository: typeof modelResultRepository,
  ) {}
  getUserData = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const checkUser = await patientRepo.findById(userId);

    if (!checkUser) {
      throw new NotFoundException("User not found");
    }

    const { password, logged_out_at, ...safeUser } = checkUser;

    return res.status(200).json({
      message: "User data fetched successfully",
      user: safeUser,
    });
  };
  getMyAnalysis = async (req: Request, res: Response): Promise<Response> => {
    if (!req.user?.id) {
      throw new UnauthorizedException("Unauthorized");
    }

    // get latest medical record
    const latestMedicalRecord =
      await this._medicalRecordRepository.findLatestByPatientId(req.user.id);

    if (!latestMedicalRecord) {
      throw new NotFoundException("No medical record found");
    }

    // get model results
    const modelResults =
      await this._modelResultRepository.findByMedicalRecordId(
        latestMedicalRecord.id,
      );

    // get latest result
    const latestResult = modelResults[0] ? modelResults[0] : null;

    return res.status(200).json({
      message: "Analysis retrieved successfully",

      data: {
        medical_record: latestMedicalRecord,

        ai_analysis: latestResult
          ? {
              clinical_score: latestResult.cvd_risk_score,
              ef_percentage: latestResult.ejection_fraction,
              global_prediction: latestResult.global_prediction,
              risk_level: latestResult.risk_level,
              model_metadata: latestResult.model_metadata,
            }
          : null,
      },
    });
  };
}

export default new UserService(medicalRecordRepository, modelResultRepository);
