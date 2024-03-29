import * as Yup from 'yup';

export const addEditRemarkValidation = Yup.object().shape({
  remarkTitle: Yup.string()
    .min(2, 'Remark title must be at least 2 characters')
    .max(20, 'Remark title must be at most 20 characters')
    .required('Remark title is required'),
  remarks: Yup.string()
    .min(5, 'Remark must be at least 5 characters')
    .max(30, 'Remark must be at most 30 characters'),
});
