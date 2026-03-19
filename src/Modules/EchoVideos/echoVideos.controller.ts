import { Router } from "express";
import echoVideosService from "./echoVideos.service";
import { validation } from "../../Middlewares/validation.middlware";


import { authenticate } from "../../Middlewares/authentication.middelware";
import { getEchoVideoSchema } from "./echoVideos.validation";
import { localFileUpload } from "../../Utils/Multer/local.multer";
const router: Router = Router();


router.post("/createEchoVideo", 
  authenticate,
  localFileUpload({customPath: "echoVideos"}).single("video"),
  echoVideosService.createEchoVideo
);

router.get("/getEchoVideo/:id", 
  authenticate,
  validation(getEchoVideoSchema),
  echoVideosService.getEchoVideo
);

export default router;
