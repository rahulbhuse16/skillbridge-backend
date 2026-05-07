import { Router } from "express";
import { createBatch,generateInvite,getBatches,joinBatch } from "../controllers/batches.js";
import { batchSummary } from "../controllers/programme.js";
export const batchRouter=Router()

batchRouter.post('/batches',createBatch)
batchRouter.post('/batches/:id/invite',generateInvite)
batchRouter.post('/batches/:id/join',joinBatch)
batchRouter.get('/batches/:id/summary',batchSummary)
batchRouter.get('/batches/:id/',getBatches)

