import * as Yup from 'yup';

export const editCandidatesValidation = Yup.object().shape({
  relevant_experience: Yup.string().required('Current years of work experience is required'),
  expected_ctc: Yup.number().positive('Expected monthly salary must be positive').nullable(true),
  current_ctc: Yup.number().positive('Current monthly salary must be positive').nullable(true),
  notice_period: Yup.number().positive('Notice Period must be positive').nullable(true),
  // resume_path: Yup.mixed()
  //   .test('fileSize', 'Resume size must be less than 2MB', value => {
  //     return value?.size <= 2000000; //2mb
  //   })
  //   .required('Resume is required'),
});
