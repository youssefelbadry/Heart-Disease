import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const AI_BASE_URL = "https://ahmedfergany-finish.hf.space";

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

export const calculateGlobalRisk = (
  clinical_score: number,

  ef: number,
) => {
  let ef_penalty = 0;

  // EF penalty
  if (ef >= 60) {
    ef_penalty = 0.0;
  } else if (ef >= 55) {
    ef_penalty = 0.15;
  } else if (ef >= 50) {
    ef_penalty = 0.3;
  } else if (ef >= 45) {
    ef_penalty = 0.5;
  } else if (ef >= 40) {
    ef_penalty = 0.7;
  } else if (ef >= 35) {
    ef_penalty = 0.9;
  } else {
    ef_penalty = 1.0;
  }

  // weights
  let w1 = 0;
  let w2 = 0;

  if (ef >= 55) {
    w1 = 0.75;
    w2 = 0.25;
  } else if (ef >= 45) {
    w1 = 0.65;
    w2 = 0.35;
  } else if (ef >= 35) {
    w1 = 0.55;
    w2 = 0.45;
  } else {
    w1 = 0.45;
    w2 = 0.55;
  }

  // calculate global risk
  let global_risk = clinical_score * w1 + ef_penalty * w2;

  // minimum risk for low EF
  if (ef < 40) {
    global_risk = Math.max(global_risk, 0.6);
  }

  // risk level
  let risk_level = "LOW";

  if (global_risk < 0.3) {
    risk_level = "LOW";
  } else if (global_risk < 0.6) {
    risk_level = "MODERATE";
  } else {
    risk_level = "HIGH";
  }

  return {
    clinical_score,

    ef_percentage: ef,

    global_risk,

    risk_level,
  };
};
