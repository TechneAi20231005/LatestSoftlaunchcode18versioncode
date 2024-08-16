import * as Yup from 'yup';
import {
  SPECIAL_CHARACTER_REGEX,
  UNDERSCORE_SPACE_SLASH_REGEX
} from '../../../../utils/regexPool';

export const addReviewCommentValidation = Yup.object().shape({
  reviewer_comment: Yup.string()
    .required('Reviewer comment is required')
    .min(2)
    .max(250, 'Review comment title must be at most 50 characters')
    .matches(
      UNDERSCORE_SPACE_SLASH_REGEX,
      'Review comment title must be alphabets'
    ),
  remark: Yup.string()
    .min(2, 'Remark description must be at least 2 characters')
    .max(100, 'Remark description must be at most 100 characters')
    .matches(
      SPECIAL_CHARACTER_REGEX,
      'Remark description name must be alphanumeric'
    )
});
