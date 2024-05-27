import * as Yup from "yup";
import {
  ALPHA_NUMERIC_REGEX,
  ONLY_CHARACTER_REGEX,
} from "../../../../settings/constants";
export const addFunctionMasterValidation = Yup.object().shape({
  function_name: Yup.string()
    .max(50, "Function  title must be at most 50 characters")
    .matches(ONLY_CHARACTER_REGEX, "Function title must be alphabets"),
  remark: Yup.string()
    .min(2, "Remark description must be at least 2 characters")
    .max(100, "Remark description must be at most 100 characters")
    .matches(
      ALPHA_NUMERIC_REGEX,
      "Remark description name must be alphanumeric"
    ),
});
