import * as Yup from 'yup';
import {
  SPECIAL_CHARACTER_REGEX,
  UNDERSCORE_SPACE_SLASH_REGEX
} from '../../../../utils/regexPool';

export const addTestingGroupValidation = Yup.object().shape({
  group_name: Yup.string()
    .required('Testing group is required')
    .max(50, 'Testing group must be at most 50 characters')
    .matches(UNDERSCORE_SPACE_SLASH_REGEX, 'Testing group must be alphabets'),
  remark: Yup.string()
    .min(2, 'Remark description must be at least 2 characters')
    .max(100, 'Remark description must be at most 100 characters')
    .matches(
      SPECIAL_CHARACTER_REGEX,
      'Remark description name must be alphanumeric'
    )
});
