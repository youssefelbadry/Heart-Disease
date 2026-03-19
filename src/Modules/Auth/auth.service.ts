import { ICreateMedicalRecordDTO } from './../MedicalRecord/medicalRecord.dto';
import { Request, Response } from "express";
import patientRepo from "../../DB/Repository/patient.repository";
import { generateHash, compareHash } from "../../Utils/Security/hash";
import { signToken } from "../../Utils/Security/token";
import { emailService, Otp } from "../../Utils/Security/generateOtp";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "../../Utils/Responsive/error.res";
import { IConfirmEmailDTO } from "./auth.dto";
import medicalRecordRepository from "../../DB/Repository/medicalRecord.repository";

class AuthService {
  signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const exists = await patientRepo.findByEmail(email);
    if (exists) throw new ConflictException("Email already exists");

    const otp = Otp.generateOtp();
    const otpExpires = Otp.otpExpiresAt();

    await patientRepo.create({
      name,
      email,
      password: await generateHash(password),
      email_otp: otp,
      email_otp_expires_at: otpExpires,
    });

    emailService(email, name, otp);

    res.status(201).json({
      message: "User created, OTP sent to email",
    });
  };
  requestConfirmEmail = async (req: Request, res: Response) => {
  const { email }: IConfirmEmailDTO = req.body;

  const patient = await patientRepo.findByEmail(email);

  if (!patient || patient.is_email_verified)
    throw new NotFoundException("User not found or already confirmed");

  if (
    patient.email_otp_expires_at &&
    new Date(patient.email_otp_expires_at) > new Date()
  ) {
    throw new BadRequestException("OTP already sent, please wait");
  }

  const otp = Otp.generateOtp();
  const otpExpires = Otp.otpExpiresAt();

  await patientRepo.updateById(patient.id, {
    email_otp: otp,
    email_otp_expires_at: otpExpires,
  });

  emailService(email, patient.name, otp);

  res.status(200).json({
    message: "OTP is sent",
  });
};


  confirmEmail = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const patient = await patientRepo.findUnverified(email);
    if (!patient) throw new NotFoundException("User not found");

    if (patient.email_otp_expires_at < new Date())
      throw new BadRequestException("OTP expired");

    if (otp !== patient.email_otp)
      throw new BadRequestException("Invalid OTP");

    await patientRepo.updateById(patient.id, {
      is_email_verified: true,
      email_otp: null,
      email_otp_expires_at: null,
    });

    res.json({ message: "Email verified successfully" });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const patient = await patientRepo.findByEmail(email);
    if (!patient || !patient.is_email_verified)
      throw new NotFoundException("Email not verified");

    const match = await compareHash(password, patient.password);
    if (!match) throw new BadRequestException("Invalid credentials");

    const token = signToken({
      id: patient.id,
      email: patient.email,
       
    });

        res.status(200).json({ message: "Login successful", access_token: token });

  };
  logout = async (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Logged out successfully",
  });
};

}

export default new AuthService();
