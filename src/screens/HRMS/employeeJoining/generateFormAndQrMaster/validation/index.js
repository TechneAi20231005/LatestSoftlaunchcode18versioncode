import * as Yup from 'yup';
import { ALPHA_NUMERIC_REGEX } from '../../../../../utils/regexPool';

export const generateFormValidation = Yup.object().shape({
  source_name: Yup.string().required('Source is required'),
  job_opening_id: Yup.array()
    .min(1, 'Select at least one job opening')
    .required('Job opening is required'),
  branch_id: Yup.array()
    .min(1, 'Select at least one location')
    .required('Location is required'),
  logo: Yup.mixed().test('logoRequired', 'Logo is required', function (value) {
    const brandingType = this.parent.branding_type;
    if (brandingType === 'logo' && !value) {
      return false;
    }
    return true;
  }),
  company_name: Yup.string()
    .test('companyNameRequired', 'Company name is required', function (value) {
      const brandingType = this.parent.branding_type;
      if (brandingType === 'text' && (!value || value.trim() === '')) {
        return false;
      }
      return true;
    })
    .matches(ALPHA_NUMERIC_REGEX, 'Company name must be alphanumeric')
    .min(2, 'Company name must be at least 2 characters')
    .max(20, 'Company name must be at most 20 characters'),
  theme_color: Yup.string().required('Theme Color is required'),

  recruiter_email_id: Yup.string()
    .nullable()
    .test('is-email-valid', 'Invalid email', function (value) {
      if (value && value.trim() !== '') {
        return Yup.string().email().isValidSync(value); // Validate only if the field is not empty
      }
      return true; // If empty, pass the validation
    }),

  recruiter_contact_no: Yup.string()
    .nullable()
    .test('is-phone-valid', 'Invalid phone number', function (value) {
      if (value && value.trim() !== '') {
        return /^[6-9]\d{9}$/.test(value); // Validate only if the field is not empty
      }
      return true; // If empty, pass the validation
    })
});
