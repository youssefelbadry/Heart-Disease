import { Request, Response } from "express";
import EchoVideoRepository from "../../DB/Repository/echoVideo.repository";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../../Utils/Responsive/error.res";
import { predictEF } from "../../Services/ai/ai.service";
import modelResultRepository from "../../DB/Repository/modelResult.repository";
import medicalRecordRepository from "../../DB/Repository/medicalRecord.repository";
import { tryRunGlobalPrediction } from "../../Services/result/createGlobalPrediction";
import { uploadBuffer } from "../../Utils/Multer/cloudinary.multer";
class EchoVideoService {
  constructor() {}

  createEchoVideo = async (req: Request, res: Response): Promise<Response> => {
    if (!req.user?.id) {
      throw new UnauthorizedException("Unauthorized");
    }

    if (!req.file) {
      throw new BadRequestException("No file uploaded");
    }

    if (!req.file.mimetype.startsWith("video/")) {
      throw new BadRequestException("Uploaded file must be a video");
    }

    // upload to cloudinary
    const uploadedVideo: any = await uploadBuffer(
      req.file,

      {
        folder: "echoVideos",

        resource_type: "video",
      },
    );

    const data = {
      patient_id: req.user.id,

      ...req.body,

      file_url: uploadedVideo.secure_url,

      video_format: req.file.mimetype,
    };

    // save video
    const videoId = await EchoVideoRepository.create(data);

    // send video to AI
    const aiResult = await predictEF(req.file);

    console.log(aiResult);

    const latestMedicalRecord =
      await medicalRecordRepository.findLatestByPatientId(req.user.id);

    // save AI result
    const incompleteResult = await modelResultRepository.findIncompleteResult(
      req.user.id,
    );

    if (incompleteResult) {
      await modelResultRepository.update(
        {
          patient_id: incompleteResult.patient_id,
        },

        {
          medical_record_id: latestMedicalRecord?.id,

          echo_video_id: videoId,

          ef_percentage: aiResult.ef_percentage,
        },
      );
    } else {
      await modelResultRepository.create({
        patient_id: req.user.id,

        medical_record_id: latestMedicalRecord?.id,

        echo_video_id: videoId,

        ef_percentage: aiResult.ef_percentage,
      });
    }

    // run global prediction
    await tryRunGlobalPrediction(req.user.id, req.file);

    return res.status(201).json({
      message: "Echo video created",

      data: {
        id: videoId,

        ...data,
      },

      ai_prediction: {
        ef_percentage: aiResult.ef_percentage,
      },
    });
  };
  getEchoVideo = async (req: Request, res: Response): Promise<Response> => {
    const video_id = Number(req.params.id);
    if (isNaN(video_id)) {
      throw new BadRequestException("Invalid video id");
    }

    const record = await EchoVideoRepository.findById(video_id, req.user.id);

    if (!record) {
      throw new NotFoundException("Echo video not found");
    }

    return res.status(200).json({
      message: "Echo video retrieved",
      data: record,
    });
  };
}

export default new EchoVideoService();
