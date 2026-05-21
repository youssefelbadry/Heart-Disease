import { Request, Response } from "express";
import ModelResultRepository from "../../DB/Repository/modelResult.repository";
import { UnauthorizedException } from "../../Utils/Responsive/error.res";

class ModelResultService {
  getByResultByPatient = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    if (!req.user?.id) {
      throw new UnauthorizedException("Unauthorized");
    }

    const results = await ModelResultRepository.findByPatientId(req.user.id);

    return res.status(200).json({
      message: "Model results retrieved",

      data: results,
    });
  };
}

export default new ModelResultService();
