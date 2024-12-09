// validation.js
import * as Yup from 'yup';
import { ALPHA_NUMERIC_REGEX } from '../../../utils/regexPool';

export const CustomValidation = (fields) => {
  const ALPHABET_REGEX = /^[A-Za-z]+$/; // Regular expression for alphabetic characters
  const EMAIL_REGEX = /^([a-z\d.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/; // Regular expression for email validation
  const CHAR_NUM_REGEX = /^[a-zA-Z0-9 !"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]+$/;
  const MOBILE_REGEX = /^(?!0{9})[0-9]{1,10}$/;
  const PASSWORD_REGEX = /^[A-Za-z0-9!@#$%^&*().,<>{}<>?_=+-|;:\'"/]/;
  return Yup.object(
    fields.reduce((acc, field) => {
      let validator = Yup.string();

      if (field.isArray) {
        validator = Yup.array()
          .of(Yup.string()) // Assuming array will contain strings
          .min(1, `${field.label} is required`); // Ensure the array has at least one element
      }
      if (field.isObject) {
        validator = Yup.array()
          .of(
            Yup.object()
          )
          .min(1, `${field.label} is required`);
      }
      if(field.email){
       validator = Yup.string()
        .email('Invalid email address')
        .required('Email Address is required');
      }
      if(field.phone){
       validator = Yup.string()
    .required('Contact Number is required')
    .length(10, 'Contact Number must be 10 digits')
    .matches(/^[0-9]+$/, 'Only numbers are allowed')
    .test(
      'startsWithValidDigit',
      'System not accepting 9 Consecutive Zeros here.',
      (value) => {
        return value ? ['6', '7', '8', '9'].includes(value.charAt(0)) : true;
      }
    )
    .test(
      'noConsecutiveZeros',
      'System not accepting 9 consecutive zeros here',
      (value) => {
        return value ? !value.includes('000000000') : true;
      }
    )
      }
      if(field.pincode){
        validator = Yup.string()
        .required('PinCode is Required')
        .length(6, 'Pincode must be 6 digits')
        .matches(
          /^[1-9]{1}[0-9]{5}$/,
          'Pincode must start with a non-zero digit and be 6 digits'
        )
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
        validator = validator.matches(
          PASSWORD_REGEX,
          `${field.label} must contain letters, numbers, and allowed special symbols`
        );
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
