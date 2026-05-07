import { Router } from "express";
import { createSession, getSessionAttendance, getStudentDashboard, } from "../controllers/sessions.js";
import { markAttendance } from "../controllers/attendance.js";
export const sessionRouter=Router()

sessionRouter.post('/sessions',createSession)
sessionRouter.get('/sessions/:id/attendance',getSessionAttendance)
sessionRouter.post('/attendance/mark',markAttendance)
sessionRouter.get(
  "/student/:student_id/dashboard",
  getStudentDashboard
);


