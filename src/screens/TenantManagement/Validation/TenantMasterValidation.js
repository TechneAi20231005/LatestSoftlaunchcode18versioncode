import * as Yup from 'yup';
export const TenantValidation = Yup.object({
  company_name: Yup.string().required('Company Name is required'),
  series: Yup.string()
    .required('Ticket ID Series is required')
    .matches(/^[A-Z]+$/, 'Only capital letters are allowed'),
  company_type: Yup.string()
    .required('Company Type is required')
    .test(
      'valid-characters',
      'Company Type can only contain letters, numbers, and certain symbols',
      (value) => {
        var regex = new RegExp(
          '^[a-zA-Z0-9 !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~]+$'
        );
        return regex.test(value);
      }
    ),
  email_id: Yup.string()
    .email('Invalid email address')
    .required('Email Address is required'),
  contact_no: Yup.string()
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
    ),
  address: Yup.string(),
  pincode: Yup.string()
    .length(6, 'Pincode must be 6 digits')
    .matches(
      /^[1-9]{1}[0-9]{5}$/,
      'Pincode must start with a non-zero digit and be 6 digits'
    ),

  country_id: Yup.string(),
  state_id: Yup.string(),
  city_id: Yup.string()
});
