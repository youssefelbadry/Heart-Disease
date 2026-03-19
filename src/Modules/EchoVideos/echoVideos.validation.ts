import * as z from "zod";


export const getEchoVideoSchema = {
  params : z.strictObject({
    id: z.coerce.number().int().positive("Patient ID must be a positive integer"),
  }),
};