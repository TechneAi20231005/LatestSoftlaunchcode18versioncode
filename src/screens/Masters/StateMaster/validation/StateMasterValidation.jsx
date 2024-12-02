import * as Yup from 'yup';
import { ALPHA_NUMERIC_REGEX } from '../../../../utils/regexPool';

export const StateMasterValidation = Yup.object().shape({
  country_id: Yup.string().required('Country name is required'),

  state: Yup.string()
    //   .min(2, 'Branch name must be at least 2 characters')
    .max(100, 'State name must be at most 100 characters')
    .matches(ALPHA_NUMERIC_REGEX, 'State name must be alphanumeric')
    .required('State name is required'),

  remark: Yup.string()
    //   .min(2, 'Remark must be at least 2 characters')
    .max(1000, 'Remark must be at most 1000 characters')
    .matches(ALPHA_NUMERIC_REGEX, 'Remark must be alphanumeric')
});
