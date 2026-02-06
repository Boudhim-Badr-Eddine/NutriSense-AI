export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * WHY: Provide a standardized 400 error.
   */
  static badRequest(message: string): ApiError {
    return new ApiError(message, 400);
  }

  /**
   * WHY: Provide a standardized 401 error.
   */
  static unauthorized(message: string): ApiError {
    return new ApiError(message, 401);
  }

  /**
   * WHY: Provide a standardized 403 error.
   */
  static forbidden(message: string): ApiError {
    return new ApiError(message, 403);
  }

  /**
   * WHY: Provide a standardized 404 error.
   */
  static notFound(message: string): ApiError {
    return new ApiError(message, 404);
  }

  /**
   * WHY: Provide a standardized 409 error.
   */
  static conflict(message: string): ApiError {
    return new ApiError(message, 409);
  }

  /**
   * WHY: Provide a standardized 422 error.
   */
  static validation(message: string): ApiError {
    return new ApiError(message, 422);
  }
}
