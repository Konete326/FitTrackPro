const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array().map(e => e.msg).join(', ') });
  }
  next();
};

const registerValidation = [
  body('Username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
  body('Email').isEmail().withMessage('Please provide a valid email'),
  body('Password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('Profile.Name').trim().notEmpty().withMessage('Name is required'),
  validate,
];

const loginValidation = [
  body('Email').isEmail().withMessage('Please provide a valid email'),
  body('Password').notEmpty().withMessage('Password is required'),
  validate,
];

const idParamValidation = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validate,
];

module.exports = { validate, registerValidation, loginValidation, idParamValidation };
