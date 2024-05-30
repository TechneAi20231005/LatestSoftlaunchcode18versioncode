import * as Yup from 'yup';
import { ALPHA_NUMERIC_REGEX } from '../../../../../utils/regexPool';

export const addEditSourceValidation = Yup.object().shape({
  source_name: Yup.string()
    .min(2, 'Source name must be at least 2 characters')
    .max(100, 'Source name must be at most 100 characters')
    .matches(ALPHA_NUMERIC_REGEX, 'Source name must be alphanumeric')

    .required('Source name is required'),
  remark: Yup.string()
    .min(2, 'Remark must be at least 2 characters')
    .max(1000, 'Remark must be at most 1000 characters')
    .matches(ALPHA_NUMERIC_REGEX, 'Remark  must be alphanumeric'),
});
