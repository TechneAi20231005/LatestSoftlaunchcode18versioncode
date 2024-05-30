import * as Yup from "yup";

export const downloadFormatFile = Yup.object().shape({
  project_id: Yup.string().required("Project Name is required"),
  module_id: Yup.string().required("Module Name is required"),
});
