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
    getProjectModuleList,
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
    module_id: '',
    submodule_id: []
  };

  const handleProjectChange = async (e, setFieldValue) => {
    setFieldValue('project_id', e.target.value);
    setFieldValue('module_id', '');
    setFieldValue('submodule_id', '');
    setModuleDropdown(null);
    const filteredModules = getModuleData
      .filter((d) => d.project_id === parseInt(e.target.value))
      .map((d) => ({ value: d.id, label: d.module_name }));

    setModuleDropdown(filteredModules);
  };

  const handleModuleChange = (e, setFieldValue) => {
    setFieldValue('module_id', e.target.value);
    setFieldValue('submodule_id', '');

    const data = getSubModuleData
      ?.filter((d) => d.module_id === parseInt(e.target.value))
      .map((d) => ({ value: d.id, label: d.sub_module_name }));

    setSubModuleDropdown(data);
  };

  const handleDownloadFormatFile = ({ formData }) => {
    console.log('hey');
    const { project_id, module_id, submodule_id } = formData;
    dispatch(
      downloadFormatFileThunk({
        project_id,
        module_id,
        submodule_id
      })
    ).then((res) => {
      console.log('res', res?.meta?.requestStatus);
      if (res?.meta?.requestStatus === 'fulfilled') {
        console.log('API Call Successful');
        close();
      }
    });
    // if (
    //   payload?.response?.status === 200 ||
    //   payload?.response?.status === 201
    // ) {
    //   console.log('API Call Successful');
    // }

    // .then(() => {
    //   console.log('API Call Successful'); // Debugging line
    //   close(); // Close the modal upon success
    // })
    // .catch((error) => {
    //   console.error('API Call Failed', error); // Debugging line
    // });
  };

  useEffect(() => {
    if (!getProjectModuleList) {
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
