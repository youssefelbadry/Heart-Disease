import * as z from "zod";
import { createModelResultSchema } from "./modelResult.validation";

export type ICreateModelResultDTO = z.infer<
  typeof createModelResultSchema.body
>;
