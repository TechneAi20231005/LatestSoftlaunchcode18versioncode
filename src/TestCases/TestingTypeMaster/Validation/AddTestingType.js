import * as Yup from "yup";

export const addTestingType = Yup.object().shape({
  title: Yup.string().required("Testing Type is required"),
  remark: Yup.string(),
});
