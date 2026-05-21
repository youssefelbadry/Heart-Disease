import * as z from "zod";
import { getEchoVideoSchema } from "./echoVideos.validation";

export type IGetEchoVideoDTO = z.infer<typeof getEchoVideoSchema.params>;
