import * as Yup from 'yup';
import { ALPHA_NUMERIC_REGEX } from '../../../../utils/regexPool';

export const statusMasterValidation = Yup.object().shape({
  status: Yup.string()
    //   .min(2, 'Branch name must be at least 2 characters')
    .max(100, 'Status name must be at most 100 characters')
    .matches(ALPHA_NUMERIC_REGEX, 'Status name must be alphanumeric')
    .required('Status name is required'),

  remark: Yup.string()
    //   .min(2, 'Remark must be at least 2 characters')
    .max(1000, 'Remark must be at most 1000 characters')
    .matches(ALPHA_NUMERIC_REGEX, 'Remark must be alphanumeric')
});
