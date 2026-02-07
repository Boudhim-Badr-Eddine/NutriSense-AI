import { body } from "express-validator";

/**
 * WHY: Validate chat payloads for message limits and ids.
 */
export const sendMessageSchema = [
  body("message")
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 500 })
    .withMessage("Message must be 1-500 characters"),
  body("conversationId").optional().isMongoId(),
];
