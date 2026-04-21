import { Router } from 'express';
import { body } from 'express-validator';

import { checkSymptoms } from '../controllers/symptomController';
import { validate } from '../middleware/validate';

const router = Router();

router.post(
  '/check',
  validate([
    body('symptoms')
      .isArray({ min: 1, max: 15 })
      .withMessage('symptoms must be an array with 1 to 15 items'),
    body('symptoms.*')
      .isString()
      .withMessage('Each symptom must be a string')
      .trim()
      .isLength({ min: 2, max: 60 })
      .withMessage('Each symptom must be between 2 and 60 characters'),
  ]),
  checkSymptoms,
);

export default router;
