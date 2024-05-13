import * as Yup from 'yup';
import { ALPHA_NUMERIC_REGEX } from '../../../../../settings/constants';

export const addEditBranchValidation = Yup.object().shape({
  location_name: Yup.string()
    .min(2, 'Branch name must be at least 2 characters')
    .max(100, 'Branch name must be at most 100 characters')
    .matches(ALPHA_NUMERIC_REGEX, 'Branch name must be alphanumeric')
    .required('Branch name is required'),
  remark: Yup.string()
    .min(2, 'Remark must be at least 2 characters')
    .max(1000, 'Remark must be at most 1000 characters')
    .matches(ALPHA_NUMERIC_REGEX, 'Remark must be alphanumeric'),
});
