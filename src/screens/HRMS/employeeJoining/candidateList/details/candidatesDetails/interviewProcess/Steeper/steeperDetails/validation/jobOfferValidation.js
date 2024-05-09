import * as Yup from 'yup';

export const jobOfferValidation = ({ isSeniorHr, isOnlyReject }) => {
  return isOnlyReject
    ? Yup.object().shape({
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
      })
    : Yup.object().shape({
        designation_id: Yup.string().required('Role is required'),
        location_id: Yup.string().required('Location is required'),
        relevant_experience: Yup.number()
          .min(0, 'Please enter valid relevant experience')
          .max(100, 'Please enter valid relevant experience')
          .required('Relevant experience is required'),
        experience_level: Yup.string().required('Experience level is required'),
        current_salary: Yup.number()
          .test('requiredIfNotFresher', 'Current salary is required', function (value) {
            const experienceLevel = this.parent.experience_level;
            return experienceLevel !== 'fresher' ? value !== undefined && value !== null : true;
          })
          .positive('Current salary must be positive'),
        preferred_salary: Yup.number()
          .positive('Preferred salary must be positive')
          .required('Preferred salary is required'),
        hr_negotiable_salary: Yup.number()
          .positive('Negotiable salary must be positive')
          .required('Negotiable salary is required'),
        sr_hr_negotiable_salary: isSeniorHr
          ? Yup.number()
              .positive('Negotiable salary from super admin must be positive')
              .required('Negotiable salary from super admin is required')
          : Yup.number(),
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
};
