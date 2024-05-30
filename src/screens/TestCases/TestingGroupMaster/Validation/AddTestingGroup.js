import * as Yup from 'yup';
import { ALPHA_NUMERIC_REGEX, ONLY_CHARACTER_REGEX } from '../../../../utils/regexPool';

export const addTestingGroupValidation = Yup.object().shape({
  group_name: Yup.string()
    .required('Testing group is required')
    .max(50, 'Testing group must be at most 50 characters')
    .matches(ONLY_CHARACTER_REGEX, 'Testing group must be alphabets'),
  remark: Yup.string()
    .min(2, 'Remark description must be at least 2 characters')
    .max(100, 'Remark description must be at most 100 characters')
    .matches(ALPHA_NUMERIC_REGEX, 'Remark description name must be alphanumeric')
});
