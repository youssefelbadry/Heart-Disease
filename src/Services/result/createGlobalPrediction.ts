import modelResultRepository from "../../DB/Repository/modelResult.repository";

import medicalRecordRepository from "../../DB/Repository/medicalRecord.repository";

import { predictGlobal } from "../ai/ai.service";

export const tryRunGlobalPrediction = async (
  patientId: number,
  file: Express.Multer.File,
) => {
  // latest clinical result
  const clinicalResult =
    await modelResultRepository.findLatestClinicalResult(patientId);

  // latest ef result
  const efResult = await modelResultRepository.findLatestEFResult(patientId);

  // stop if one missing
  if (!clinicalResult || !efResult) {
    return;
  }

  // latest medical record
  const latestMedicalRecord =
    await medicalRecordRepository.findLatestByPatientId(patientId);

  if (!latestMedicalRecord) {
    return;
  }

  // run AI global prediction
  const globalResult = await predictGlobal(
    file,

    {
      male: latestMedicalRecord.male,

      age: latestMedicalRecord.age,

      currentSmoker: latestMedicalRecord.currentSmoker,

      BPMeds: latestMedicalRecord.BPMeds,

      prevalentHyp: latestMedicalRecord.prevalentHyp,

      diabetes: latestMedicalRecord.diabetes,

      sysBP: latestMedicalRecord.sysBP,

      diaBP: latestMedicalRecord.diaBP,
    },
  );
  console.log(clinicalResult);

  console.log(efResult);
  console.log(globalResult);
  // save global result
  await modelResultRepository.updatePublic(
    {
      id: efResult.id,
    },

    {
      global_prediction: globalResult.global_risk,

      risk_level: globalResult.risk_level,
    },
  );
};
