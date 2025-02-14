import * as Yup from 'yup';
import { ALPHA_NUMERIC_REGEX } from '../../../../../utils/regexPool';

export const addEditSalaryValidation = Yup.object().shape({
  department_id: Yup.string().required('Department is required'),
  designation_id: Yup.string().required('Designation is required'),
  location_id: Yup.array()
    .min(1, 'Please select at least one location')
    .required('Preferred designation is required'),
  experience_level: Yup.string().required('Experience level is required'),
  max_salary: Yup.number()
    .positive('Max salary must be positive')
    .required('Max salary is required'),
  remark: Yup.string()
    .min(2, 'Remark must be at least 2 characters')
    .max(1000, 'Remark must be at most 1000 characters')
    .matches(ALPHA_NUMERIC_REGEX, 'Remark must be alphanumeric'),
});
