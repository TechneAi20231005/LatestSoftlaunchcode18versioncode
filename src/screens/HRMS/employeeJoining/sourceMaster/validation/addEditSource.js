import * as Yup from 'yup';

export const addEditSourceValidation = Yup.object().shape({
  branch: Yup.string()
    .min(2, 'Source Name must be at least 2 characters')
    .max(20, 'Source Name must be at most 20 characters')
    .required('Source Name is required'),
  remarks: Yup.string()
    .min(5, 'Remark must be at least 5 characters')
    .max(30, 'Remark must be at most 30 characters'),
});
