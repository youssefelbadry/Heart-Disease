import modelResultRepository from "../../DB/Repository/modelResult.repository";

import { calculateGlobalRisk } from "../ai/ai.service";

export const tryRunGlobalPrediction = async (patientId: number) => {
  // latest clinical result
  const clinicalResult =
    await modelResultRepository.findLatestClinicalResult(patientId);

  // latest ef result
  const efResult = await modelResultRepository.findLatestEFResult(patientId);

  // stop if one missing
  if (!clinicalResult || !efResult) {
    return;
  }

  // calculate global locally
  const globalResult = calculateGlobalRisk(
    clinicalResult.cvd_risk_score,

    efResult.ef_percentage,
  );

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
