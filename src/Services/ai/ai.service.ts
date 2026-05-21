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
export const predictEF = async (videoPath: string) => {
  const resolvedPath = path.resolve(videoPath);

  console.log("VIDEO PATH:", resolvedPath);

  console.log("FILE EXISTS:", fs.existsSync(resolvedPath));

  const formData = new FormData();

  formData.append(
    "video",

    fs.createReadStream(resolvedPath),
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

export const predictGlobal = async (
  videoPath: string,

  features: any,
) => {
  const resolvedPath = path.resolve(videoPath);

  const formData = new FormData();

  formData.append(
    "video",

    fs.createReadStream(resolvedPath),
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
