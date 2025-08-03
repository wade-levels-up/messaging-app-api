import { body, ValidationChain } from "express-validator";

export const validateEmail: ValidationChain[] = [
  body("email")
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage("Email must be between 3 and 100 characters")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail()
    .escape()
];

export const validateUsername: ValidationChain[] = [
  body("username")
    .trim()
    .isLength({ min: 2, max: 24 })
    .withMessage("Username must be between 2 and 24 characters")
    .matches(/^\S+$/)
    .withMessage("Name cannot contain spaces")
    .escape()
];

export const validatePassword: ValidationChain[] = [
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be greater than 8 characters")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .not()
    .isIn(['password', '12345678', 'qwerty'])
    .withMessage("Do not use a common, easily guessed password")
];

export const validateContent: ValidationChain[] = [
  body("content")
  .trim()
  .isLength({ min: 1})
  .withMessage("Text must be greater than 1 character")
  .matches(/^[^<>]*$/)
  .withMessage("Text cannot contain < or > characters")
]

export const validateGroupChat: ValidationChain[] = [
  body("name")
  .trim()
  .isLength({ min: 1, max: 16 })
  .withMessage("Name must be between 1 and 16 characters long")
  .matches(/^[^<>]*$/)
  .withMessage("Text cannot contain < or > characters")
  ,
  body("creator")
  .trim()
  .isLength({ min: 2, max: 24 })
  .withMessage("Creator's name must be between 2 and 24 characters")
  .matches(/^\S+$/)
  .withMessage("Creator's name cannot contain spaces")
  .escape()
]