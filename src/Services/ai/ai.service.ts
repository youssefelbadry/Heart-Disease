import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const AI_BASE_URL = "https://ahmedfergany-last-update.hf.space";

// =========================
// Clinical Prediction
// =========================

export const predictClinical = async (data: any) => {
  const response = await axios.post(`${AI_BASE_URL}/predict_clinical`, data);

  return response.data;
};

// =========================
// Echo Video Prediction
// =========================

// export const predictEF = async (videoPath: string) => {
//   const resolvedPath = path.resolve(videoPath);

//   console.log("VIDEO PATH:", resolvedPath);

//   console.log("FILE EXISTS:", fs.existsSync(resolvedPath));

//   const formData = new FormData();

//   formData.append(
//     "video",

//     fs.createReadStream(resolvedPath),
//   );

//   const response = await axios.post(
//     `${AI_BASE_URL}/predict_ef`,

//     formData,

//     {
//       headers: formData.getHeaders(),
//     },
//   );

//   return response.data;
// };

export const predictEF = async (file: Express.Multer.File) => {
  const formData = new FormData();

  formData.append(
    "video",

    file.buffer,

    {
      filename: file.originalname,

      contentType: file.mimetype,
    },
  );

  const response = await axios.post(
    `${AI_BASE_URL}/predict_ef`,

    formData,

    {
      headers: formData.getHeaders(),
    },
  );

  return response.data;
};

// =========================
// Global Prediction
// =========================

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value);

const appendVideoSource = async (formData: FormData, videoSource: string) => {
  if (isHttpUrl(videoSource)) {
    const response = await axios.get(videoSource, {
      responseType: "stream",
    });

    const fileName = videoSource.split("/").pop() || "video";

    formData.append("video", response.data, {
      filename: fileName,
    });

    return;
  }

  const resolvedPath = path.resolve(videoSource);

  formData.append("video", fs.createReadStream(resolvedPath));
};

export const predictGlobal = async (
  file: Express.Multer.File,

  features: any,
) => {
  const formData = new FormData();

  formData.append(
    "video",

    file.buffer,

    {
      filename: file.originalname,

      contentType: file.mimetype,
    },
  );

  const response = await axios.post(
    `${AI_BASE_URL}/predict_global`,

    formData,

    {
      params: {
        features: JSON.stringify(features),
      },

      headers: formData.getHeaders(),
    },
  );

  return response.data;
};
