// validation.js
import * as Yup from 'yup';
import {
  ALPHA_NUMERIC_REGEX,
  UNDERSCORE_SPACE_SLASH_REGEX,
  UNDERSCORE_SPACE_REGEX
} from '../../../utils/regexPool';

export const CustomValidation = (fields) => {
  return Yup.object(
    fields.reduce((acc, field) => {
      let validator = Yup.string();

      if (field.dateRange) {
        validator = Yup.date()
          .typeError(`${field.label} must be a valid date`)
          .nullable()
          .test('validDate', `${field.label} must be a valid date`, (value) => {
            return value ? !isNaN(new Date(value).getTime()) : true;
          });

        if (field.name === field.dateRange.endDate) {
          validator = validator.test(
            'isAfterStartDate',
            `Please select Date After ${field.dateRange.startLabel}`,
            function (value) {
              const startDate = this.parent[field.dateRange.startDate];
              if (value && startDate) {
                return new Date(value) >= new Date(startDate);
              }
              return true;
            }
          );
        }
      }

      if (field.isArray) {
        validator = Yup.array()
          .of(Yup.string())
          .min(1, `${field.label} is required`);
      }
      if (field.isObject) {
        validator = Yup.array()
          .of(Yup.object())
          .min(1, `${field.label} is required`);
      }
      if (field.email) {
        validator = Yup.string()
          .email('Invalid email address')
          .required('Email Address is required');
      }
      if (field.phone) {
        validator = Yup.string()
          .required('Contact Number is required')
          .length(10, 'Contact Number must be 10 digits')
          .matches(/^[0-9]+$/, 'Only numbers are allowed')
          .test(
            'startsWithValidDigit',
            'Mobile Number must start with digit in between 6 to 9',
            (value) => {
              return value
                ? ['6', '7', '8', '9'].includes(value.charAt(0))
                : true;
            }
          )
          .test(
            'noConsecutiveZeros',
            'System not accepting 9 consecutive zeros here',
            (value) => {
              return value ? !value.includes('000000000') : true;
            }
          );
      }
      if (field.pincode) {
        validator = Yup.string()
          .required('PinCode is Required')
          .length(6, 'Pincode must be 6 digits')
          .matches(
            /^[1-9]{1}[0-9]{5}$/,
            'Pincode must start with a non-zero digit and be 6 digits'
          );
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

      if (field.alphaBet) {
        validator = validator.matches(
          field.name === 'type_name'
            ? UNDERSCORE_SPACE_SLASH_REGEX
            : UNDERSCORE_SPACE_REGEX,
          `${field.label} must be alphabet`
        );
      }

      acc[field.name] = validator;
      return acc;
    }, {})
  );
};
