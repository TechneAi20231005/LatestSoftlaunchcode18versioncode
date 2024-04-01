import * as Yup from 'yup';

export const addEditSourceValidation = Yup.object().shape({
  source: Yup.string()
    .min(2, 'Source Name must be at least 2 characters')
    .max(100, 'Source Name must be at most 100 characters')
    .required('Source Name is required'),
  remarks: Yup.string()
    .min(2, 'Remark must be at least 2 characters')
    .max(1000, 'Remark must be at most 1000 characters'),
});
