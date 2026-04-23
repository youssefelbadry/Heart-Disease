import { Request, Response } from "express";
import patientRepo from "../../DB/Repository/patient.repository";
import { generateHash, compareHash } from "../../Utils/Security/hash";
import { signToken } from "../../Utils/Security/token";
import { emailService } from "../../Utils/Security/generateOtp";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "../../Utils/Responsive/error.res";
import { IForgetPasswordDTO, IResetPasswordDTO } from "./auth.dto";

class AuthService {
  signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const exists = await patientRepo.findByEmail(email);
    if (exists) throw new ConflictException("Email already exists");

    await patientRepo.create({
      name,
      email,
      password: await generateHash(password),
    });

    emailService.sendWelcomeEmail(email, name);

    res.status(201).json({
      message: "User created successfully",
    });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const patient = await patientRepo.findByEmail(email);
    if (!patient) throw new NotFoundException("Email not found");

    const match = await compareHash(password, patient.password);
    if (!match) throw new BadRequestException("Invalid credentials");

    const token = signToken({
      id: patient.id,
      email: patient.email,
    });
    await patientRepo.updateById(patient.id, {
      logged_out_at: null,
    });

    res.status(200).json({ message: "Login successful", access_token: token });
  };
  forgetPassword = async (req: Request, res: Response) => {
    const { email }: IForgetPasswordDTO = req.body;
    const patient = await patientRepo.findByEmail(email);
    if (!patient) throw new NotFoundException("User not found");

    res.json({ message: "go to reset password page" });
  };
  resetPassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword }: IResetPasswordDTO = req.body;
    const user = await patientRepo.findByEmail(req.user.email);
    if (!user) throw new NotFoundException("User not found");
    if (!(await compareHash(oldPassword, user.password))) {
      throw new BadRequestException("Invalid old password");
    }
    if (oldPassword === newPassword) {
      throw new BadRequestException(
        "New password must be different from old password",
      );
    }

    await patientRepo.updateById(user.id, {
      password: await generateHash(newPassword),
    });

    res.json({ message: "password reset successfully" });
  };
  logout = async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new BadRequestException("Invalid token payload");
    }

    await patientRepo.updateById(req.user.id, {
      logged_out_at: new Date(),
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  };
}

export default new AuthService();
