import * as z from "zod";
import {
  createEchoVideoSchema,
} from "./echoVideos.validation";

export type ICreateEchoVideoDTO = z.infer<typeof createEchoVideoSchema.body>;

