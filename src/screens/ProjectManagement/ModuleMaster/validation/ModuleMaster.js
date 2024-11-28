import * as Yup from 'yup';
import { ALPHA_NUMERIC_REGEX } from '../../../../utils/regexPool';

export const moduleMasterValidation = Yup.object().shape({
  project_id: Yup.string().required('Project name is required'),
  module_name: Yup.string()
    //   .min(2, 'Branch name must be at least 2 characters')
    .max(100, 'Module name must be at most 100 characters')
    .matches(ALPHA_NUMERIC_REGEX, 'Module name must be alphanumeric')
    .required('Module name is required'),

  description: Yup.string()
    //   .min(2, 'Branch name must be at least 2 characters')
    .max(1000, 'Description must be at most 1000 characters')
    .matches(ALPHA_NUMERIC_REGEX, 'Description name must be alphanumeric')
    .required('Description is required'),

  remark: Yup.string()
    //   .min(2, 'Remark must be at least 2 characters')
    .max(1000, 'Remark must be at most 1000 characters')
    .matches(ALPHA_NUMERIC_REGEX, 'Remark must be alphanumeric')
});
