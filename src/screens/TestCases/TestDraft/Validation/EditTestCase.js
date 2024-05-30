import * as Yup from "yup";

export const editTestCaseValidation = Yup.object().shape({
  project_id: Yup.string().required("Function is required"),
  module_id: Yup.string().required("Function is required"),
  submodule_id: Yup.string().required("Function is required"),
  function_id: Yup.string().required("Function is required"),
  field: Yup.string().required("Function is required"),
  type_id: Yup.string().required("Function is required"),
  group_id: Yup.string().required("Function is required"),
  id: Yup.string().required("Function is required"),
  severity: Yup.string().required("Function is required"),
  steps: Yup.string().required("Function is required"),
  test_description: Yup.string().required("Function is required"),
  expected_result: Yup.string().required("Function is required"),
});
