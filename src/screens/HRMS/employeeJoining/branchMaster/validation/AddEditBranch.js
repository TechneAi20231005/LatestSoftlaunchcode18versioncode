import * as Yup from 'yup';

export const addEditBranchValidation = Yup.object().shape({
  branch: Yup.string()
    .min(2, 'Branch Name must be at least 2 characters')
    .max(20, 'Branch Name must be at most 20 characters')
    .required('Branch Name is required'),
  remarks: Yup.string()
    .min(5, 'Remark must be at least 5 characters')
    .max(30, 'Remark must be at most 30 characters'),
});
