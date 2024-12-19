import * as Yup from 'yup';
import {
  SPECIAL_CHARACTER_REGEX,
  UNDERSCORE_SPACE_SLASH_REGEX
} from '../../../../utils/regexPool';
export const addJobRoleMasterValidation = Yup.object().shape({
  job_role: Yup.string()
    .required('Job role title is required ')
    .min(2)
    .max(100, 'Job role  title must be at most 100 characters')
    .matches(UNDERSCORE_SPACE_SLASH_REGEX, 'Job role title must be alphabets'),
  remark: Yup.string()
    .min(2, 'Remark description must be at least 2 characters')
    .max(1000, 'Remark description must be at most 1000 characters')
    .matches(
      SPECIAL_CHARACTER_REGEX,
      'Remark description name must be alphanumeric'
    )
});
