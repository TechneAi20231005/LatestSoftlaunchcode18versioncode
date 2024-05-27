import * as Yup from "yup";

export const editTestCaseValidation = Yup.object().shape({
  project_name: Yup.string().required("Function is required"),
  module_name: Yup.string().required("Function is required"),
  submodule_name: Yup.string().required("Function is required"),
  function: Yup.string().required("Function is required"),
  field: Yup.string().required("Function is required"),
  testing_type: Yup.string().required("Function is required"),
  testing_group: Yup.string().required("Function is required"),
  test_id: Yup.string().required("Function is required"),
  severity: Yup.string().required("Function is required"),
  steps: Yup.string().required("Function is required"),
  test_description: Yup.string().required("Function is required"),
  expected_result: Yup.string().required("Function is required"),
});
