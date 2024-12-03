// validation.js
import * as Yup from 'yup';
import { ALPHA_NUMERIC_REGEX } from '../../../utils/regexPool';

export const CustomValidation = (fields) => {
  return Yup.object(
    fields.reduce((acc, field) => {
      let validator = Yup.string();

      if (field.isArray) {
        validator = Yup.array()
          .of(Yup.string())
          .min(1, `${field.label} is required`);
      }
      if (field.isObject) {
        validator = Yup.array()
          .of(
            Yup.object()
          )
          .min(1, `${field.label} is required`);
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


      acc[field.name] = validator;
      return acc;
    }, {})
  );
};
