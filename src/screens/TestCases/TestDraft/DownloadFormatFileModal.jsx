import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import CustomModal from '../../../components/custom/modal/CustomModal';
import {
  CustomDropdown,
  CustomReactSelect
} from '../../../components/custom/inputs/CustomInputs';
import { downloadFormatFile } from './Validation/DownloadFormatFile';

import {
  downloadFormatFileThunk,
  getModuleMasterThunk,
  getProjectModuleMasterThunk,
  getSubModuleMasterThunk
} from '../../../redux/services/testCases/downloadFormatFile';

function DownloadFormatFileModal({ show, close }) {
  const {
    getProjectModuleListId,
    getModuleList,
    getSubModuleList,
    getModuleData,
    getSubModuleData
  } = useSelector((state) => state?.downloadFormat);

  const dispatch = useDispatch();

  const [moduleDropdown, setModuleDropdown] = useState();

  const [subModuleDropdown, setSubModuleDropdown] = useState();

  const moduleIdRef = useRef();
  const subModuleIdRef = useRef();

  const downloadFormatInitialValue = {
    project_id: '',
    module_id: [],
    submodule_id: []
  };

  const handleProjectChange = async (e, setFieldValue) => {
    console.log('eeee', e.target.value);
    setFieldValue('project_id', e.target.value);
    setFieldValue('module_id', '');
    setFieldValue('submodule_id', '');
    setModuleDropdown(null);
    const filteredModules = getModuleData
      .filter((d) => d.project_id == e.target.value)
      .map((d) => ({ value: d.id, label: d.module_name }));
    setModuleDropdown(filteredModules);
  };

  // const handleModuleChange = (e, setFieldValue) => {
  //   console.log('eeee', e.target.value);
  //   setFieldValue('module_id', e.target.value);
  //   setFieldValue('submodule_id', '');

  //   const data = getSubModuleData
  //     ?.filter((d) => d.module_name === e.target.value)
  //     .map((d) => ({ value: d.sub_module_name, label: d.sub_module_name }));

  //   setSubModuleDropdown(data);
  // };

  const handleModuleChange = (selectedOptions) => {
    // selectedOptions is an array of selected { label, value } objects from react-select
    const selectedModuleValues = selectedOptions?.map((opt) => opt.value) || [];

    const selectedModuleNames = selectedOptions?.map((opt) => opt.value) || [];
    const data = getSubModuleData
      ?.filter((d) => selectedModuleNames.includes(d.module_id))
      .map((d) => ({ value: d.id, label: d.sub_module_name }));

    setSubModuleDropdown(data);
  };

  const handleDownloadFormatFile = ({ formData }) => {
    const { project_id, module_id, submodule_id } = formData;
    // return false
    dispatch(
      downloadFormatFileThunk({
        project_name: project_id,
        module_name: module_id,
        submodule_name: submodule_id
      })
    ).then((res) => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        close();
      }
    });
  };

  useEffect(() => {
    if (!getProjectModuleListId) {
      dispatch(getProjectModuleMasterThunk());
    }
    if (!getModuleList) {
      dispatch(getModuleMasterThunk());
    }
    if (!getSubModuleList) {
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
                    classNamePrefix="react-select"
                    data={getProjectModuleListId}
                    component={CustomDropdown}
                    name="project_id"
                    label="Project Name"
                    id="testdraft_projectname"
                    requiredField
                    handleChange={(event) =>
                      handleProjectChange(event, setFieldValue)
                    }
                  />
                </Col>
                <Col md={4} lg={4}>
                  {/* <Field
                    classNamePrefix="react-select"
                    data={moduleDropdown}
                    component={CustomDropdown}
                    name="module_id"
                    label="Module Name"
                    id="testdraft_modulename"
                    requiredField
                    handleChange={(event) =>
                      handleModuleChange(event, setFieldValue)
                    }
                    ref={moduleIdRef}
                  /> */}
                  {console.log('moduleDropdown', moduleDropdown)}
                  <Field
                    classNamePrefix="react-select"
                    options={moduleDropdown}
                    component={CustomReactSelect}
                    name="module_id"
                    label="Module Name"
                    id="testdraft_modulename"
                    placeholder="Select"
                    ref={moduleIdRef}
                    isMulti
                    handleChange={(event) =>
                      handleModuleChange(event, setFieldValue)
                    }
                    // required
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    classNamePrefix="react-select"
                    options={subModuleDropdown}
                    component={CustomReactSelect}
                    name="submodule_id"
                    label="SubModule Name"
                    id="testdraft_submodulename"
                    placeholder="Select"
                    ref={subModuleIdRef}
                    isMulti
                    // required
                  />
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="submit" className="btn btn bg-success text-white">
                  Download CSV
                </button>
                <button
                  type="button"
                  className="btn btn-danger text-white"
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
