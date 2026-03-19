import { Request, Response } from "express";
import EchoVideoRepository from "../../DB/Repository/echoVideo.repository";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../../Utils/Responsive/error.res";

class EchoVideoService {
  constructor() {}

  createEchoVideo = async (
    req: Request,
    res: Response
  ): Promise<Response> => {

    if (!req.user?.id) {
      throw new UnauthorizedException("Unauthorized");
    }

    if (!req.file) {
      throw new BadRequestException("No file uploaded");
    }

    if (!req.file.mimetype.startsWith("video/")) {
      throw new BadRequestException("Uploaded file must be a video");
    }

    if (!req.uploadedFilePath) {
      throw new BadRequestException("File path not generated");
    }

    const data = {
      patient_id: req.user.id,
      ...req.body,
      file_url: req.uploadedFilePath,
      video_format: req.file.mimetype,
    };

    const videoId = await EchoVideoRepository.create(data);

    return res.status(201).json({
      message: "Echo video created",
      data: {
        id: videoId,
        ...data,
      },
    });
  };

  getEchoVideo = async (
    req: Request,
    res: Response
  ): Promise<Response> => {

    const video_id = Number(req.params.id);
    if (isNaN(video_id)) {
      throw new BadRequestException("Invalid video id");
    }

    const record = await EchoVideoRepository.findById(
      video_id,
      req.user.id
    );

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
