import React, { useEffect, useReducer, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row, Stack, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import CustomModal from '../../../components/custom/modal/CustomModal';
import {
  CustomDropdown,
  CustomInput,
  CustomTextArea
} from '../../../components/custom/inputs/CustomInputs';
import { editTestCaseValidation } from './Validation/EditTestCase';
import {
  editTestCaseThunk,
  getDraftTestCaseList,
  getModuleMasterThunk,
  getProjectModuleMasterThunk,
  getSubModuleMasterThunk
} from '../../../redux/services/testCases/downloadFormatFile';
import { getFunctionMasterListThunk } from '../../../redux/services/testCases/functionMaster';
import { getTestingGroupMasterListThunk } from '../../../redux/services/testCases/testingGroupMaster';
import { getTestingTypeMasterListThunk } from '../../../redux/services/testCases/testingTypeMaster';

function EditTestCaseModal({ show, close, type, currentTestCasesData, paginationData }) {
  // // initial state

  const severityData = [
    {
      value: 'High',
      label: 'High'
    },
    {
      value: 'Medium',
      label: 'Medium'
    },
    {
      value: 'Medium',
      label: 'Medium'
    }
  ];
  const dispatch = useDispatch();

  const { filterFunctionMasterList } = useSelector((state) => state?.functionMaster);

  const { filterTestingGroupMasterList } = useSelector((state) => state?.testingGroupMaster);
  const { filterTestingTypeMasterList } = useSelector((state) => state?.testingTypeMaster);

  console.log('filterFunctionMasterList', filterFunctionMasterList);
  console.log('filterTestingGroupMasterList', filterTestingGroupMasterList);

  console.log('filterTestingTypeMasterList', filterTestingTypeMasterList);

  const { getProjectModuleList, getModuleList, getSubModuleList } = useSelector(
    (state) => state?.downloadFormat
  );

  console.log('currentTestCasesData', currentTestCasesData);
  const testCaseInitialValue = {
    project_id: type === 'EDIT' ? currentTestCasesData?.project_id?.toString() : '',
    module_id: type === 'EDIT' ? currentTestCasesData?.module_id?.toString() : '',
    submodule_id: type === 'EDIT' ? currentTestCasesData?.submodule_id?.toString() : '',
    function_id: type === 'EDIT' ? currentTestCasesData?.function_id?.toString() : '',
    field: type === 'EDIT' ? currentTestCasesData?.field : '',
    type_id: type === 'EDIT' ? currentTestCasesData?.type_id?.toString() : '',
    group_id: type === 'EDIT' ? currentTestCasesData?.group_id?.toString() : '',
    severity: type === 'EDIT' ? currentTestCasesData?.severity : '',
    steps: type === 'EDIT' ? currentTestCasesData?.steps : '',
    test_description: type === 'EDIT' ? currentTestCasesData?.test_description : '',
    expected_result: type === 'EDIT' ? currentTestCasesData?.expected_result : ''
  };

  const handleEditTestCase = ({ formData }) => {
    dispatch(
      editTestCaseThunk({
        currentId: currentTestCasesData?.id,
        formData: formData,
        onSuccessHandler: () => {
          close();
          dispatch(
            getDraftTestCaseList({
              limit: paginationData.rowPerPage,
              page: paginationData.currentPage
            })
          );
        },
        onErrorHandler: () => {}
      })
    );
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
    dispatch(getFunctionMasterListThunk());
    dispatch(getTestingGroupMasterListThunk());
    dispatch(getTestingTypeMasterListThunk());
  }, []);
  return (
    <>
      <CustomModal show={show} title="Edit Test Case" width="lg">
        <Formik
          initialValues={testCaseInitialValue}
          validationSchema={editTestCaseValidation}
          onSubmit={(values) => {
            handleEditTestCase({ formData: values });
          }}
        >
          {({ values, touched, errors, setFieldValue }) => (
            <Form>
              <Row className="row_gap_3">
                <Col md={4} lg={4}>
                  <Field
                    data={getProjectModuleList}
                    component={CustomDropdown}
                    name="project_id"
                    label="Project Name"
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    data={getModuleList}
                    component={CustomDropdown}
                    name="module_id"
                    label="Module Name"
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    data={getSubModuleList}
                    component={CustomDropdown}
                    name="submodule_id"
                    label="SubModule Name"
                    placeholder="Select"
                  />
                </Col>

                <Col md={4} lg={4}>
                  <Field
                    data={filterFunctionMasterList}
                    component={CustomDropdown}
                    name="function_id"
                    label="Function"
                    placeholder="Enter function name"
                    requiredField
                  />
                </Col>

                <Col md={4} lg={4}>
                  <Field
                    component={CustomInput}
                    name="field"
                    label="Field"
                    placeholder="Enter field name"
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    data={filterTestingTypeMasterList}
                    component={CustomDropdown}
                    name="type_id"
                    label="Testing Type"
                    placeholder="Enter testing type name"
                    requiredField
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    data={filterTestingGroupMasterList}
                    component={CustomDropdown}
                    name="group_id"
                    label="Testing Group"
                    placeholder="Enter testing group name"
                    requiredField
                  />
                </Col>

                <Col md={4} lg={4}>
                  <Field
                    data={severityData}
                    component={CustomDropdown}
                    name="severity"
                    label="Severity"
                    placeholder="Enter Severity"
                    requiredField
                  />
                </Col>

                <Col md={6} lg={6}>
                  <Field
                    component={CustomTextArea}
                    name="steps"
                    label="Steps"
                    placeholder="Enter steps"
                  />
                </Col>

                <Col md={6} lg={6}>
                  <Field
                    component={CustomTextArea}
                    name="test_description"
                    label="Test Description"
                    placeholder="Enter test description"
                    requiredField
                  />
                </Col>

                <Col md={6} lg={6}>
                  <Field
                    component={CustomTextArea}
                    name="expected_result"
                    label="Expected Result"
                    placeholder="Enter expected result"
                    requiredField
                  />
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-dark px-4" type="submit">
                  Update
                </button>
                <button onClick={close} className="btn btn-shadow-light px-3" type="button">
                  Close
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CustomModal>
    </>
  );
}

export default EditTestCaseModal;
