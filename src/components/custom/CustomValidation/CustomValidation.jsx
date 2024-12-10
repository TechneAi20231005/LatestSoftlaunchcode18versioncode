// validation.js
import * as Yup from 'yup';
import { ALPHA_NUMERIC_REGEX } from '../../../utils/regexPool';

export const CustomValidation = (fields) => {
  const ALPHABET_REGEX = /^[A-Za-z]+$/; // Regular expression for alphabetic characters
  const EMAIL_REGEX = /^([a-z\d.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/; // Regular expression for email validation
  const CHAR_NUM_REGEX = /^[a-zA-Z0-9 !"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]+$/;
  const MOBILE_REGEX = /^(?!0{9})[0-9]{1,10}$/;
  const PASSWORD_REGEX =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return Yup.object(
    fields.reduce((acc, field) => {
      let validator = Yup.string();

      if (field.isArray) {
        validator = Yup.array()
          .of(Yup.string()) // Assuming array will contain strings
          .min(1, `${field.label} is required`); // Ensure the array has at least one element
      }

      // Required field validation
      if (field.required) {
        validator = validator.required(`${field.label} is required`);
      }

      // Min length validation
      if (field.min) {
        validator = validator.min(
          field.min,
          `${field.label} must be at least ${field.min} characters`
        );
      }

      // Max length validation
      if (field.max) {
        validator = validator.max(
          field.max,
          `${field.label} must be at most ${field.max} characters`
        );
      }

      // Alpha-numeric validation
      if (field.alphaNumeric) {
        validator = validator.matches(
          ALPHA_NUMERIC_REGEX,
          `${field.label} must be alphanumeric`
        );
      }

      if (field.onlyAlphabets) {
        validator = validator.test(
          'onlyAlphabets',
          `${field.label} must contain only alphabetic characters`,
          (value) => !value || ALPHABET_REGEX.test(value)
        );
      }

      if (field.isEmail) {
        validator = validator.matches(
          EMAIL_REGEX,
          `${field.label} must be a valid email address`
        );
      }

      if (field.allowCharactersAndNumbers) {
        validator = validator.test(
          'allowCharactersAndNumbers',
          `${field.label} must contain only alphabetic characters`,
          (value) => !value || CHAR_NUM_REGEX.test(value)
        );
      }

      if (field.mobileOnly) {
        validator = validator.matches(
          MOBILE_REGEX,
          `${field.label} must be a valid mobile number (1 to 10 digits, no all zeros)`
        );
      }
      if (field.isPassword) {
        validator = validator
          .min(6, `${field.label} must be at least 6 characters`)
          .max(20, `${field.label} cannot exceed 20 characters`);
      }

      if (field.isObject) {
        validator = Yup.array()
          .of(Yup.object())
          .min(1, `${field.label} is required`);
      }

      // Add the final validator to the schema
      acc[field.name] = validator;
      return acc;
    }, {})
  );
};
