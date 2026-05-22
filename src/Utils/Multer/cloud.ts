import { Request } from "express";

import multer, { FileFilterCallback } from "multer";

import { BadRequestException } from "../Responsive/error.res";

const ALLOWED_VIDEO_MIME_TYPES = [
  "video/mp4",

  "video/mpeg",

  "video/quicktime",

  "video/x-msvideo",

  "video/x-matroska",

  "video/webm",

  "video/mkv",
];

interface LocalUploadOptions {
  customPath?: string;
}

export const localFileUpload = ({}: LocalUploadOptions) => {
  // memory storage for Vercel
  const storage = multer.memoryStorage();

  const fileFilter = (
    req: Request,

    file: Express.Multer.File,

    cb: FileFilterCallback,
  ) => {
    if (!ALLOWED_VIDEO_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new BadRequestException(
          "Invalid file type. Only video files are allowed",
        ),
      );
    }

    cb(null, true);
  };

  return multer({
    storage,

    fileFilter,

    limits: {
      fileSize: 500 * 1024 * 1024, // 500MB
    },
  });
};
