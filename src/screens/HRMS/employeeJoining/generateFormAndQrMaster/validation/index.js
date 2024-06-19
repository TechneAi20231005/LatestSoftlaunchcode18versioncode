import * as Yup from 'yup';
import { ALPHA_NUMERIC_REGEX } from '../../../../../utils/regexPool';

export const generateFormValidation = Yup.object().shape({
  tenant_name: Yup.string().required('Tenant name is required'),
  source_name: Yup.string().required('Source is required'),
  job_opening_id: Yup.array()
    .min(1, 'Select at least one job opening')
    .required('Job opening is required'),
  branch_id: Yup.array()
    .min(1, 'Select at least one location')
    .required('Location is required'),
  logo: Yup.mixed().test('logoRequired', 'Logo is required', function (value) {
    const brandingType = this.parent.branding_type;
    if (brandingType === 'logo' && (!value || value.trim() === '')) {
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
  company_name_color: Yup.string().when('branding_type', {
    is: 'text',
    then: Yup.string().required('Company name color is required')
  }),
  company_name_color: Yup.string().test(
    'companyNameColorRequired',
    'Company name color is required',
    function (value) {
      const brandingType = this.parent.branding_type;
      if (brandingType === 'text' && (!value || value.trim() === '')) {
        return false;
      }
      return true;
    }
  ),
  requiter_email_id: Yup.string()
    .test(
      'either-email-or-contact',
      'Requiter email ID is required',
      (value) => {
        if (!value?.requiter_contact_no && (!value || value.trim() === '')) {
          return false;
        }
        return true;
      }
    )
    .email('Invalid email'),
  requiter_contact_no: Yup.string()
    .test(
      'either-email-or-contact',
      'Requiter contact number is required',
      (value) => {
        if (!value?.requiter_email_id && (!value || value.trim() === '')) {
          return false;
        }
        return true;
      }
    )
    .matches(/^[6-9]\d{9}$/, 'Invalid phone number')
});
