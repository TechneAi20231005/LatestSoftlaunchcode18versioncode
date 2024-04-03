import * as Yup from 'yup';

export const addEditRemarkValidation = Yup.object().shape({
  remarkDescription: Yup.string()
    .min(2, 'Remark description must be at least 2 characters')
    .max(1000, 'Remark description must be at most 1000 characters')
    .required('Remark description is required'),
  supportingRemark: Yup.string()
    .min(2, 'Supporting remarks must be at least 2 characters')
    .max(1000, 'Supporting remarks must be at most 1000 characters'),
});