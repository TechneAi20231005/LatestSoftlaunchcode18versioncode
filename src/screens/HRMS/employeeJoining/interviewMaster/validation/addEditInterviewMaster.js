import * as Yup from 'yup';

const addEditInterviewMaster = Yup.object().shape({
  department_id: Yup.string().required('Department is required'),
  designation_id: Yup.string().required('Designation is required'),
  experience_level: Yup.string().required('Experience level is required'),
  step_details: Yup.array().of(
    Yup.object().shape({
      step_title: Yup.string()
        .min(2, 'Step title must be at least 2 characters')
        .max(50, 'Step title must be at most 50 characters')
        .required('Step title is required'),
      designation_id: Yup.string().required('Designation is required'),
      employee_id: Yup.string().required('Name is required'),
      // employee_email: Yup.string().email('Invalid email').required('Email is required'),
    }),
  ),
  remark: Yup.string()
    .min(2, 'Remark must be at least 2 characters')
    .max(1000, 'Remark must be at most 1000 characters'),
});

export default addEditInterviewMaster;
