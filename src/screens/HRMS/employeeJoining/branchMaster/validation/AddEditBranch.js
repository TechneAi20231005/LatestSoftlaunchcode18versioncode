import * as Yup from 'yup';

export const addEditBranchValidation = Yup.object().shape({
  branch: Yup.string()
    .min(2, 'Branch name must be at least 2 characters')
    .max(100, 'Branch name must be at most 100 characters')
    .required('Branch name is required'),
  remarks: Yup.string()
    .min(2, 'Remark must be at least 2 characters')
    .max(1000, 'Remark must be at most 1000 characters'),
});
