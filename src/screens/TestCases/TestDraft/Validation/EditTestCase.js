import * as Yup from 'yup';

export const editTestCaseValidation = Yup.object().shape({
  project_id: Yup.string().required('Project name is required'),
  module_id: Yup.string().required('Module name is required'),
  function_id: Yup.string().required('Function is required'),
  type_id: Yup.string().required('Testing type is required'),
  group_id: Yup.string().required('Testing group is required'),
  severity: Yup.string().required('Severity is required'),
  test_description: Yup.string().required('Test Description is required'),
  expected_result: Yup.string().required('Expected result is required')
});
