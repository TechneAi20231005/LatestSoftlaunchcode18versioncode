import * as Yup from 'yup';

export const editCandidatesValidation = Yup.object().shape({
  relevant_experience: Yup.string().required('Current years of work experience is required'),
  expected_ctc: Yup.number().min(0, 'Expected monthly salary must be 0 or greater'),
  current_ctc: Yup.number().min(0, 'Current monthly salary must be 0 or greater'),
  notice_period: Yup.number().min(0, 'Notice Period must be 0 or greater'),
  // resume_path: Yup.mixed()
  //   .test('fileSize', 'Resume size must be less than 2MB', value => {
  //     return value?.size <= 2000000; //2mb
  //   })
  //   .required('Resume is required'),
});
