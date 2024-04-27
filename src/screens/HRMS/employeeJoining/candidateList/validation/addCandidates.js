import * as Yup from 'yup';

export const addCandidatesValidation = Yup.object().shape({
  source_id: Yup.string().required('Source is required'),
  referred_by_name: Yup.string()
    .test('referred_by', 'Referred by name is required', function (value) {
      const source_id = this.parent.source_id;
      if (source_id === '1' && (!value || value.trim() === '')) {
        return false;
      }
      return true;
    })
    .min(2, 'Referred by name must be at least 2 characters')
    .max(50, 'Referred by name must be at least 50 characters'),

  full_name: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be at most 50 characters')
    .required('Full name is required'),
  dob: Yup.date()
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      'You must be at least 18 years old',
    )
    .required('Date of Birth is required'),

  designation_id: Yup.array()
    .required('Preferred role is required')
    .min(1, 'Please select at least one Preferred role'),
  location_id: Yup.array()
    .required('Preferred location is required')
    .min(1, 'Please select at least one location'),
  mobile_no: Yup.string()
    .required('Phone number is required')
    .matches(/^[6-9]\d{9}$/, 'Invalid phone number'),
  email: Yup.string().email('Invalid email'),
  relevant_experience: Yup.string().required('Current years of work experience is required'),
  expected_ctc: Yup.number().positive('Expected monthly salary must be positive'),
  current_ctc: Yup.number().positive('Current monthly salary must be positive'),
  notice_period: Yup.number().positive('Notice Period must be positive'),
  resume_path: Yup.mixed()
    .test('fileSize', 'Resume size must be less than 2MB', value => {
      return value?.size <= 2000000; //2mb
    })
    .required('Resume is required'),
});
