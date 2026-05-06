import { Router } from "express";
import { institutionSummary, programmeSummary } from "../controllers/programme.js";

export const managementRouter=Router()

managementRouter.get('/institutions/:id/summary',institutionSummary)

managementRouter.get('/programme/summary',programmeSummary)
