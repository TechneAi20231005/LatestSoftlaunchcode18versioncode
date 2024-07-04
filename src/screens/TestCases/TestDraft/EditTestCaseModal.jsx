import React, { useEffect, useRef, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import CustomModal from '../../../components/custom/modal/CustomModal';
import {
  CustomDropdown,
  CustomInput,
  CustomReactSelect,
  CustomTextArea
} from '../../../components/custom/inputs/CustomInputs';
import { editTestCaseValidation } from './Validation/EditTestCase';
import {
  editTestCaseThunk,
  getByTestPlanIDReviewedListThunk,
  getDraftTestCaseList,
  getModuleMasterThunk,
  getProjectModuleMasterThunk,
  getSubModuleMasterThunk
} from '../../../redux/services/testCases/downloadFormatFile';
import { getFunctionMasterListThunk } from '../../../redux/services/testCases/functionMaster';
import { getTestingGroupMasterListThunk } from '../../../redux/services/testCases/testingGroupMaster';
import { getTestingTypeMasterListThunk } from '../../../redux/services/testCases/testingTypeMaster';
import { getByTestPlanIDListThunk } from '../../../redux/services/testCases/testCaseReview';

function EditTestCaseModal({
  show,
  close,
  type,
  currentTestCasesData,
  paginationData,
  id,
  payloadType
}) {
  const dispatch = useDispatch();
  const { filterFunctionMasterList } = useSelector(
    (state) => state?.functionMaster
  );

  const { filterTestingGroupMasterList } = useSelector(
    (state) => state?.testingGroupMaster
  );
  const { filterTestingTypeMasterList } = useSelector(
    (state) => state?.testingTypeMaster
  );

  const {
    getProjectModuleList,
    getModuleList,
    getSubModuleList,
    getModuleData,
    getSubModuleData
  } = useSelector((state) => state?.downloadFormat);

  const newModuleListData = getModuleData
    ?.filter((d) => d.project_id === currentTestCasesData?.project_id)
    ?.map((i) => ({ value: i.id, label: i.module_name }));

  const newSubModuleListData = getSubModuleData
    ?.filter((d) => d.module_id === currentTestCasesData?.module_id)
    ?.map((i) => ({ value: i.id, label: i.sub_module_name }));

  const [moduleDropdown, setModuleDropdown] = useState();

  const [subModuleDropdown, setSubModuleDropdown] = useState();
  const [disable, setDisable] = useState(false);

  const severityData = [
    {
      value: 'Very High',
      label: 'Very High'
    },
    {
      value: 'High',
      label: 'High'
    },
    {
      value: 'Medium',
      label: 'Medium'
    },
    {
      value: 'Low',
      label: 'Low'
    }
  ];
  const testCaseInitialValue = {
    project_id:
      type === 'EDIT' ? currentTestCasesData?.project_id?.toString() : '',
    module_id:
      type === 'EDIT' ? currentTestCasesData?.module_id?.toString() : '',
    submodule_id:
      type === 'EDIT' ? currentTestCasesData?.submodule_id?.toString() : '',
    function_id:
      type === 'EDIT' ? currentTestCasesData?.function_id?.toString() : '',
    field: type === 'EDIT' ? currentTestCasesData?.field : '',
    type_id: type === 'EDIT' ? currentTestCasesData?.type_id?.toString() : '',
    tc_id: type === 'EDIT' ? currentTestCasesData?.tc_id?.toString() : '',
    group_id: type === 'EDIT' ? currentTestCasesData?.group_id?.toString() : '',
    severity: type === 'EDIT' ? currentTestCasesData?.severity : '',
    steps: type === 'EDIT' ? currentTestCasesData?.steps : '',
    test_description:
      type === 'EDIT' ? currentTestCasesData?.test_description : '',
    expected_result:
      type === 'EDIT' ? currentTestCasesData?.expected_result : ''
  };
  const handleEditTestCase = ({ formData }) => {
    setDisable(true);
    dispatch(
      editTestCaseThunk({
        currentId: currentTestCasesData?.tc_id,
        formData: formData,
        onSuccessHandler: () => {
          close();
          setDisable(false);
          {
            payloadType === 'DRAFT' &&
              dispatch(
                getDraftTestCaseList({
                  limit: paginationData.rowPerPage,
                  page: paginationData.currentPage
                })
              );
          }
          {
            payloadType === 'TestCaseReview' &&
              dispatch(
                getByTestPlanIDListThunk({
                  id: id,
                  limit: paginationData.rowPerPage,
                  page: paginationData.currentPage
                })
              );
          }

          {
            payloadType === 'ReviewTestDraft' &&
              dispatch(
                getByTestPlanIDReviewedListThunk({
                  id: id,
                  limit: paginationData.rowPerPage,
                  page: paginationData.currentPage
                })
              );
          }
        },
        onErrorHandler: () => {}
      })
    );
  };

  const handleProjectChange = async (e, setFieldValue) => {
    setFieldValue('project_id', e.target.value);
    setFieldValue('module_id', '');
    setFieldValue('submodule_id', '');
    setModuleDropdown(null);
    setSubModuleDropdown(null);
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

  useEffect(() => {
    if (getProjectModuleList?.length <= 0) {
      dispatch(getProjectModuleMasterThunk());
    }
    if (getModuleList.length <= 0) {
      dispatch(getModuleMasterThunk());
    }
    if (getSubModuleList?.length <= 0) {
      dispatch(getSubModuleMasterThunk());
    }
    // dispatch(
    //   getByTestPlanIDListThunk({
    //     id: id,
    //     limit: paginationData.rowPerPage,
    //     page: paginationData.currentPage
    //   })
    // );
    dispatch(getFunctionMasterListThunk());
    dispatch(getTestingGroupMasterListThunk());
    dispatch(getTestingTypeMasterListThunk());
    setSubModuleDropdown(newSubModuleListData);
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
          {({ setFieldValue }) => (
            <Form>
              <Row className="row_gap_3">
                <Col md={4} lg={4}>
                  <Field
                    data={getProjectModuleList}
                    component={CustomDropdown}
                    name="project_id"
                    label="Project Name"
                    placeholder="Select"
                    requiredField
                    handleChange={(event) =>
                      handleProjectChange(event, setFieldValue)
                    }
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    data={!moduleDropdown ? newModuleListData : moduleDropdown}
                    component={CustomDropdown}
                    name="module_id"
                    label="Module Name"
                    requiredField
                    placeholder="Select"
                    handleChange={(event) =>
                      handleModuleChange(event, setFieldValue)
                    }
                  />
                </Col>

                <Col md={4} lg={4}>
                  <Field
                    data={subModuleDropdown}
                    component={CustomDropdown}
                    name="submodule_id"
                    label="SubModule Name"
                    placeholder="Select"
                    // isMulti
                    requiredField
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
                    component={CustomInput}
                    name="tc_id"
                    label="Test Id"
                    placeholder="Enter testing id"
                    requiredField
                    disabled
                  />
                </Col>

                <Col md={4} lg={4}>
                  <Field
                    options={filterTestingGroupMasterList}
                    component={CustomReactSelect}
                    name="group_id"
                    label="Testing Group"
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
                <button
                  // disabled={disable}
                  className="btn btn-dark px-4"
                  type="submit"
                >
                  Update
                </button>
                <button
                  onClick={close}
                  className="btn btn-shadow-light px-3"
                  type="button"
                >
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
