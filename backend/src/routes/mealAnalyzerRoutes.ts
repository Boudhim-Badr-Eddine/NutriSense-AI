import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";

import { analyzeMealPhoto } from "../controllers/mealAnalyzerController";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback,
  ) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype.toLowerCase())) {
      callback(null, true);
      return;
    }

    callback(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only image/jpeg, image/jpg, image/png, image/webp are allowed",
      ),
    );
  },
});

const uploadSingleImage = (req: Request, res: Response, next: NextFunction) => {
  upload.single("image")(req, res, (error: unknown) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({
          success: false,
          error: "Image must be 5MB or smaller",
        });
        return;
      }

      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        res.status(400).json({
          success: false,
          error: "Unsupported image format. Use jpg, jpeg, png, or webp",
        });
        return;
      }
    }

    res.status(400).json({
      success: false,
      error: "Invalid image upload",
    });
  });
};

const router = Router();

router.post("/analyze", uploadSingleImage, analyzeMealPhoto);

export default router;