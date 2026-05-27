import path from "path";
import multer from "multer";
import type { Request } from "express";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

const uploadBase = env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(uploadBase, "resumes"));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  }
});

export const resumeUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter(_req: Request, file, cb) {
    if (ALLOWED_MIME.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new HttpError(400, "Only PDF, DOC, or DOCX files are accepted for resumes.") as unknown as null, false);
    }
  }
});
