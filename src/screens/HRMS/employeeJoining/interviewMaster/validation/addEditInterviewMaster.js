import * as Yup from 'yup';

const stepValidation = stepCount => {
  const stepSchema = {};

  for (let i = 0; i < stepCount; i++) {
    const stepIndex = i + 1;
    stepSchema[`stepTitle_${stepIndex}`] = Yup.string().required(
      `Step ${stepIndex} Title is required`,
    );
    stepSchema[`designation_${stepIndex}`] = Yup.string().required(
      `Step ${stepIndex} Designation is required`,
    );
    stepSchema[`name_${stepIndex}`] = Yup.string().required(`Step ${stepIndex} Name is required`);
    stepSchema[`email_${stepIndex}`] = Yup.string()
      .email(`Step ${stepIndex} Email is invalid`)
      .required(`Step ${stepIndex} Email is required`);
  }

  return Yup.object().shape(stepSchema);
};

const addEditInterviewMaster = Yup.object().shape({
  department: Yup.string().required('Department is required'),
  designation: Yup.string().required('Designation is required'),
  experienceLevel: Yup.string().required('Experience Level is required'),
  stepCount: Yup.string().required('Step Count is required'),
  stepDetails: Yup.lazy((values = {}) => stepValidation(parseInt(values.stepCount) || 0)),
});

export default addEditInterviewMaster;
