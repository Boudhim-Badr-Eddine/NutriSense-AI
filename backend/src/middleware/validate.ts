import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";

/**
 * WHY: Enforce request validation consistently across endpoints.
 */
export const validate = (schemas: ValidationChain[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    await Promise.all(schemas.map((schema) => schema.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
      return;
    }

    return next();
  };
};
