import * as Yup from 'yup';

export const editCandidatesValidation = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Full Name must be at least 2 characters')
    .max(50, 'Full Name must be at most 50 characters')
    .required('Full Name is required'),
  dob: Yup.date()
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      'You must be at least 18 years old',
    )
    .required('Date of Birth is required'),

  preferredLocation: Yup.array().required('Preferred Location is required'),
  preferredRole: Yup.array().required('Preferred role is required'),
  phoneNumber: Yup.string()
    .required('Phone Number is required')
    .matches(/^[6-9]\d{9}$/, 'Invalid phone number'),
  currentMonthlySalary: Yup.number().positive('Current monthly salary must be positive'),
  expectedMonthlySalary: Yup.number().positive('Expected monthly salary must be positive'),
  noticePeriod: Yup.number().positive('Notice Period must be positive'),
});
