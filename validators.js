const { body, validationResult } = require('express-validator');

const validateMovie = (req, res, next) => {
  const { title, director, year, color, duration } = req.body;
  const errors = [];
  if (title == null) {
    errors.push({ field: 'title', message: 'this field is required' });
  } else if (title.length >= 255) {
    errors.push({
      field: 'title',
      message: 'Should contain less than 255 characters',
    });
  }

  if (director == null) {
    errors.push({ field: 'director', message: 'this field is required' });
  }
  if (year == null) {
    errors.push({ field: 'year', message: 'this field is required' });
  }
  if (color == null) {
    errors.push({ field: 'color', message: 'this field is required' });
  }
  if (duration == null) {
    errors.push({ field: 'duration', message: 'this field is required' });
  }

  if (errors.length) {
    res.status(422).send({ validationErr: errors });
  } else {
    next();
  }
};

const validateUser = [
  body('firstname').notEmpty().isString().isLength({ max: 255 }),
  body('lastname').notEmpty().isString().isLength({ max: 255 }),
  body('email').trim().notEmpty().isEmail(),
  body('city').optional().isLength({ max: 255 }),
  body('language').optional().isLength({ max: 255 }),
  body('password').notEmpty().matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ validationErrors: errors.array() });
    } else {
      next();
    }
  },
];

module.exports = {
  validateMovie,
  validateUser,
};
