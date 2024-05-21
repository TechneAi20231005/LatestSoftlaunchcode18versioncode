import * as Yup from "yup";

export const addFunctionMasterValidation = Yup.object().shape({
  title: Yup.string().required("Function title is required"),
  remark: Yup.string(),
});
