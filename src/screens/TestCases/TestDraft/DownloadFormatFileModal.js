import React, { useEffect, useRef, useState } from "react";
import { Field, Form, Formik } from "formik";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "../../../components/custom/modal/CustomModal";
import {
  CustomDropdown,
  CustomReactSelect,
} from "../../../components/custom/inputs/CustomInputs";
import { downloadFormatFile } from "./Validation/DownloadFormatFile";

import {
  downloadFormatFileThunk,
  getModuleMasterThunk,
  getProjectModuleMasterThunk,
  getSubModuleMasterThunk,
} from "../../../redux/services/testCases/downloadFormatFile";

function DownloadFormatFileModal({ show, close }) {
  const {
    getProjectModuleList,
    getMouleList,
    getSubMouleList,
    getModuleData,
    getSubModuleData,
  } = useSelector((state) => state?.downloadFormat);

  // // initial state
  const dispatch = useDispatch();

  const [moduleDropdown, setModuleDropdown] = useState();

  const [subModuleDropdown, setSubModuleDropdown] = useState();

  const moduleIdRef = useRef();
  const subModuleIdRef = useRef();

  const handleProjectChange = async (e, setFieldValue) => {
    setFieldValue("project_id", e.target.value);
    setFieldValue("module_id", ""); // Clear module_name when project_name changes
    setFieldValue("submodule_id", "");
    setModuleDropdown(null); // Clear the current module dropdown options
    const filteredModules = getModuleData
      .filter((d) => d.project_id === parseInt(e.target.value))
      .map((d) => ({ value: d.id, label: d.module_name }));

    setModuleDropdown(filteredModules);
  };

  const handleModuleChange = (e, setFieldValue) => {
    setFieldValue("module_id", e.target.value);
    setFieldValue("submodule_id", ""); // Clear submodule_name when module_name changes

    const data = getSubModuleData
      ?.filter((d) => d.module_id === parseInt(e.target.value)) // Ensure correct data type
      .map((d) => ({ value: d.id, label: d.sub_module_name }));

    setSubModuleDropdown(data); // Set the filtered data for subModuleDropdown
  };

  const downloadFormatInitialValue = {
    project_id: "",
    module_id: "",
    submodule_id: [],
  };

  const handleDownloadFormatFile = (formData) => {
    const { project_id, module_id, submodule_id } = formData.formData;

    dispatch(
      downloadFormatFileThunk({
        project_id,
        module_id,
        submodule_id,

        onSuccessHandler: () => {
          close();
        },
        onErrorHandler: () => {},
      })
    );
  };

  useEffect(() => {
    if (!getProjectModuleList) {
      dispatch(getProjectModuleMasterThunk());
    }
    if (!getMouleList) {
      dispatch(getModuleMasterThunk());
    }
    if (!getSubMouleList) {
      dispatch(getSubModuleMasterThunk());
    }
  }, []);

  return (
    <>
      <CustomModal show={show} title="Download Format File" width="lg">
        <Formik
          initialValues={downloadFormatInitialValue}
          validationSchema={downloadFormatFile}
          onSubmit={(values) => {
            handleDownloadFormatFile({ formData: values });
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              <Row className="row_gap_3">
                <Col md={4} lg={4}>
                  <Field
                    data={getProjectModuleList}
                    component={CustomDropdown}
                    name="project_id"
                    label="Project Name"
                    handleChange={(event) =>
                      handleProjectChange(event, setFieldValue)
                    }
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    data={moduleDropdown}
                    component={CustomDropdown}
                    name="module_id"
                    label="Module Name"
                    handleChange={(event) =>
                      handleModuleChange(event, setFieldValue)
                    }
                    ref={moduleIdRef}
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    options={subModuleDropdown}
                    component={CustomReactSelect}
                    name="submodule_id"
                    label="SubModule Name"
                    placeholder="Select"
                    ref={subModuleIdRef}
                    isMulti
                    required
                  />
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="submit" className="btn btn bg-success text-white">
                  Download CSV
                </button>
                <button
                  type="button"
                  className="btn btn bg-white shadow p-2 text-black"
                  onClick={() => close()}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CustomModal>
    </>
  );
}

export default DownloadFormatFileModal;
