import * as Yup from "yup";
import {
  ALPHA_NUMERIC_REGEX,
  ONLY_CHARACTER_REGEX,
} from "../../../settings/constants";
export const addReviewCommentValidation = Yup.object().shape({
  reviewer_comment: Yup.string()
    .max(50, "Supporting title must be at most 50 characters")
    .matches(ONLY_CHARACTER_REGEX, "Supporting remark name must be alphabets"),
  remark: Yup.string()
    .min(2, "Remark description must be at least 2 characters")
    .max(100, "Remark description must be at most 100 characters")
    .matches(
      ALPHA_NUMERIC_REGEX,
      "Remark description name must be alphanumeric"
    ),
});
