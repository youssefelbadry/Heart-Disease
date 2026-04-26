import { Request, Response } from "express";
import patientRepo from "../../DB/Repository/patient.repository";
import { NotFoundException } from "../../Utils/Responsive/error.res";

class UserService {
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
}

export default new UserService();
