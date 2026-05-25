const { body, validationResult } = require('express-validator');

// Resuable validation checker middleware
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return res.status(400).json({
      success: false,
      message: `Input Validation Error: ${errorMessages}`
    });
  }
  next();
};

const validateRegister = [
  body('name')
    .notEmpty().withMessage('Legal name is required')
    .trim(),
  body('email')
    .isEmail().withMessage('Valid email format is required')
    .normalizeEmail(),
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\+?[0-9\s-]{10,15}$/).withMessage('Phone number format is invalid'),
  body('aadhaar')
    .notEmpty().withMessage('Aadhaar number is required')
    .matches(/^\d{4}-\d{4}-\d{4}$/).withMessage('Aadhaar number must format as XXXX-XXXX-XXXX'),
  body('wallet')
    .notEmpty().withMessage('Wallet address is required')
    .matches(/^0x[a-fA-F0-9]{40}$/).withMessage('Wallet public address must be a valid 42-character Ethereum hex string'),
  body('password')
    .isLength({ min: 6 }).withMessage('Signature password must be at least 6 characters long'),
  validateResult
];

const validateLogin = [
  body('aadhaar')
    .notEmpty().withMessage('Aadhaar number is required')
    .matches(/^\d{4}-\d{4}-\d{4}$/).withMessage('Aadhaar must format as XXXX-XXXX-XXXX'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validateResult
];

const validateLand = [
  body('surveyNumber')
    .notEmpty().withMessage('Survey plot number is required')
    .trim(),
  body('area')
    .notEmpty().withMessage('Land area dimension is required')
    .trim(),
  body('district')
    .notEmpty().withMessage('Zoning district is required')
    .trim(),
  body('state')
    .notEmpty().withMessage('State zone is required')
    .trim(),
  body('gps')
    .notEmpty().withMessage('GPS coordinate reference is required'),
  body('coordinates')
    .isArray({ min: 4 }).withMessage('Boundary polygon must contain at least 4 coordinate points'),
  validateResult
];

const validateTransfer = [
  body('landId')
    .isMongoId().withMessage('Invalid Land Registry Mongoose Object ID'),
  body('toName')
    .notEmpty().withMessage('Recipient legal name is required')
    .trim(),
  body('toWallet')
    .notEmpty().withMessage('Recipient wallet key is required')
    .matches(/^0x[a-fA-F0-9]{40}$/).withMessage('Recipient wallet must be a valid 42-character Ethereum hex address'),
  body('toAadhaar')
    .notEmpty().withMessage('Recipient Aadhaar is required')
    .matches(/^\d{4}-\d{4}-\d{4}$/).withMessage('Recipient Aadhaar must format as XXXX-XXXX-XXXX'),
  validateResult
];

module.exports = {
  validateRegister,
  validateLogin,
  validateLand,
  validateTransfer
};
