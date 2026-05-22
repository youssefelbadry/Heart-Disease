import { BadRequestException } from "../Responsive/error.res";
import { v2 as cloudinary, UploadApiOptions } from "cloudinary";
import { Readable } from "node:stream";
import { readFile } from "node:fs/promises";

const configureCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      "Cloudinary environment variables are missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
};

const resolveUploadBuffer = async (
  fileOrBuffer: Buffer | Express.Multer.File,
): Promise<Buffer> => {
  if (Buffer.isBuffer(fileOrBuffer)) {
    if (!fileOrBuffer.length) {
      throw new BadRequestException("File buffer is empty");
    }

    return fileOrBuffer;
  }

  if (fileOrBuffer.buffer?.length) {
    return fileOrBuffer.buffer;
  }

  if (fileOrBuffer.path) {
    const diskBuffer = await readFile(fileOrBuffer.path);

    if (!diskBuffer.length) {
      throw new BadRequestException("File buffer is empty");
    }

    return diskBuffer;
  }

  throw new BadRequestException("File buffer is empty");
};

export const uploadBuffer = async (
  fileOrBuffer: Buffer | Express.Multer.File,
  options: UploadApiOptions,
) => {
  const buffer = await resolveUploadBuffer(fileOrBuffer);

  configureCloudinary();

  return await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

export const deleteFile = async (
  publicId: string,
  resourceType: "image" | "raw" = "raw",
) => {
  if (!publicId) return;
  configureCloudinary();
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};
