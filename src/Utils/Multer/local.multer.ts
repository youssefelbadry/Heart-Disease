import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "node:path";
import fs from "node:fs";
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

export const localFileUpload = ({
  customPath = "general",
}: LocalUploadOptions) => {
  const basePath = `uploads/${customPath}`;

  const storage = multer.diskStorage({
    destination: (req: Request, _file, cb) => {
      if (!req.user?.id) {
        return cb(new BadRequestException("Unauthorized upload"), "");
      }

      const userBasePath = `${basePath}/${req.user.id}`;
      const fullPath = path.resolve(`./src/${userBasePath}`);

      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }

      cb(null, fullPath);
    },

    filename: (req: Request, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(
        Math.random() * 1e9,
      )}${path.extname(file.originalname)}`;

      req.uploadedFilePath = `${basePath}/${req.user!.id}-${uniqueName}`;

      cb(null, uniqueName);
    },
  });

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
