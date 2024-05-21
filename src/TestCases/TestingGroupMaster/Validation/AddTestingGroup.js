import * as Yup from "yup";

export const addTestingGroupValidation = Yup.object().shape({
  title: Yup.string().required("Testing group is required"),
  remark: Yup.string(),
});
