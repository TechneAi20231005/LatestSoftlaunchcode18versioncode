import * as Yup from "yup";

export const downloadFormatFile = Yup.object().shape({
  project_name: Yup.string().required("Function is required"),
  module_name: Yup.string().required("Function is required"),
  submodule_name: Yup.string().required("Function is required"),
});
