import { Router } from "express";
import { createBatch,generateInvite,getBatches,getTrainerDashboard,joinBatch } from "../controllers/batches.js";
import { batchSummary } from "../controllers/programme.js";
export const batchRouter=Router()

batchRouter.post('/batches',createBatch)
batchRouter.post('/batches/invite',generateInvite)
batchRouter.post('/batches/join',joinBatch)
batchRouter.get('/batches/:id/summary',batchSummary)
batchRouter.get('/batches/:id/',getBatches)
batchRouter.get("/:trainer_id/dashboard", getTrainerDashboard);

