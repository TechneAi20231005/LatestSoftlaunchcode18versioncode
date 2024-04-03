import * as Yup from 'yup';

export const addEditSalaryValidation = Yup.object().shape({
  department: Yup.string().required('Department is required'),
  designation: Yup.string().required('Designation is required'),
  location: Yup.array()
    .min(1, 'Please select at least one location')
    .required('Preferred role is required'),
  experienceLevel: Yup.string().required('Experience level is required'),
  maxSalary: Yup.number()
    .positive('Max salary must be positive')
    .required('Max salary is required'),
  remarks: Yup.string()
    .min(5, 'Remark must be at least 5 characters')
    .max(30, 'Remark must be at most 30 characters'),
});
