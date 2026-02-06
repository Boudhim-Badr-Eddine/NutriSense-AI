import { NextFunction, Request, Response } from "express";

/**
 * Wrap async route handlers and forward errors to the global handler.
 * WHY: Prevents unhandled promise rejections in Express.
 */
export const catchAsync = <TRequest extends Request>(
  handler: (req: TRequest, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: TRequest, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
};
