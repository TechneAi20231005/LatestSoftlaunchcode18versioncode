import * as Yup from 'yup';

export const jobOfferValidation = Yup.object().shape({
  designation_id: Yup.string().required('Role is required'),
  location_id: Yup.string().required('Location is required'),
  relevant_experience: Yup.number()
    .min(0, 'Please enter valid relevant experience')
    .max(100, 'Please enter valid relevant experience')
    .required('Relevant experience is required'),
  experience_level: Yup.string().required('Experience level is required'),
  // max_salary: Yup.number()
  //   .positive('Max salary must be positive')
  //   .required('Max salary is required'),
  preferred_salary: Yup.number()
    .positive('Preferred salary must be positive')
    .required('Preferred salary is required'),
  negotiable_salary: Yup.number()
    .positive('Negotiable salary must be positive')
    .required('Negotiable salary is required'),
  remark_id: Yup.string().required('Remark is required'),
  other_remark: Yup.string()
    .test('otherRemarkRequired', 'Specify Other remarks are required', function (value) {
      const remarkId = this.parent.remark_id;
      if (remarkId === '0' && (!value || value.trim() === '')) {
        return false;
      }
      return true;
    })
    .min(2, 'Specify Other remarks must be at least 2 characters')
    .max(1000, 'Specify Other remarks must be at most 1000 characters'),
});
