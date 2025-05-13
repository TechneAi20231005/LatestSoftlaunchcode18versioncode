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
  addTestCaseThunk,
  editTestCaseThunk,
  getByTestPlanIDReviewedListThunk,
  getDraftTestCaseList,
  getModuleMasterThunk,
  getProjectModuleMasterThunk,
  getSubModuleMasterThunk,
  getTestCaseStatusDataList
} from '../../../redux/services/testCases/downloadFormatFile';
import { getFunctionMasterListThunk } from '../../../redux/services/testCases/functionMaster';
import { getTestingGroupMasterListThunk } from '../../../redux/services/testCases/testingGroupMaster';
import { getTestingTypeMasterListThunk } from '../../../redux/services/testCases/testingTypeMaster';
import { getByTestPlanIDListThunk } from '../../../redux/services/testCases/testCaseReview';
import { original } from '@reduxjs/toolkit';
import { getReviewCommentMasterListThunk } from '../../../redux/services/testCases/reviewCommentMaster';

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
    getProjectModuleListId,
    getModuleList,
    getSubModuleList,
    getModuleData,
    getSubModuleData,
    testCasesStatusDataList
  } = useSelector((state) => state?.downloadFormat);
  const newModuleListData = getModuleData
    ?.filter((d) => d.project_id === currentTestCasesData?.original?.project_id)
    ?.map((i) => ({ value: i.id, label: i.module_name }));

  const newSubModuleListData = getSubModuleData
    ?.filter((d) => d.module_id === currentTestCasesData?.original?.module_id)
    ?.map((i) => ({ value: i.id, label: i.sub_module_name }));
  const { getFilterReviewCommentMasterList } = useSelector(
    (state) => state?.reviewCommentMaster
  );
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
  const automationScriptData = [
    {
      value: 'Y',
      label: 'Yes'
    },
    {
      value: 'N',
      label: 'No'
    }
  ];
  const testingGroupRef = useRef();

  const testCaseInitialValue = {
    project_id:
      type === 'EDIT'
        ? currentTestCasesData?.original?.project_id?.toString()
        : '',
    module_id:
      type === 'EDIT'
        ? currentTestCasesData?.original?.module_id?.toString()
        : '',
    submodule_id:
      type === 'EDIT'
        ? currentTestCasesData?.original?.submodule_id?.toString()
        : '',
    function_id:
      type === 'EDIT'
        ? currentTestCasesData?.original?.function_id?.toString()
        : '',
    field: type === 'EDIT' ? currentTestCasesData?.original?.field : '',
    type_id:
      type === 'EDIT'
        ? currentTestCasesData?.original?.type_id?.toString()
        : '',
    // tc_id: type === 'EDIT' ? currentTestCasesData?.tc_id?.toString() : '',
    testing_group:
      type === 'EDIT'
        ? currentTestCasesData?.original?.testing_group?.toString()
        : [],

    severity: type === 'EDIT' ? currentTestCasesData?.original?.severity : '',
    is_automation_script:
      type === 'EDIT'
        ? currentTestCasesData?.original?.is_automation_script
        : '',

    reviewer_comment_id:
      type === 'EDIT'
        ? currentTestCasesData?.original?.reviewer_comment_id
        : '',

    steps: type === 'EDIT' ? currentTestCasesData?.original?.steps : '',
    test_description:
      type === 'EDIT' ? currentTestCasesData?.original?.test_description : '',
    expected_result:
      type === 'EDIT' ? currentTestCasesData?.original?.expected_result : ''
  };

  const handleEditTestCase = ({ formData }) => {
    setDisable(true);

    {
      type === 'Add'
        ? dispatch(
            addTestCaseThunk({
              formData: formData,
              onSuccessHandler: () => {
                close();
                dispatch(
                  getByTestPlanIDListThunk({
                    id: id,
                    limit: paginationData.rowPerPage,
                    page: 1,
                    filter_testcase_data: []
                  })
                );
              }
            })
          )
        : dispatch(
            editTestCaseThunk({
              currentId: currentTestCasesData?.original?.id,
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
    }
  };
  const handleProjectChange = async (e, setFieldValue) => {
    console.log('sss', getModuleData);
    setFieldValue('project_id', e?.target?.value);
    setFieldValue('module_id', '');
    setFieldValue('submodule_id', '');
    setModuleDropdown(null);
    setSubModuleDropdown(null);
    const filteredModules = getModuleData
      .filter((d) => d.project_id == e.target.value)
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
    if (getProjectModuleListId?.length <= 0) {
      dispatch(getProjectModuleMasterThunk());
    }
    if (getModuleList?.length <= 0) {
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
    dispatch(getReviewCommentMasterListThunk());
  }, []);

  useEffect(() => {
    dispatch(
      getTestCaseStatusDataList({
        limit: paginationData.pageSize,
        page: paginationData.pageIndex
      })
    );
  }, [paginationData.pageSize, paginationData.pageIndex]);

  return (
    <>
      <CustomModal
        show={show}
        title={type === 'Add' ? 'Add Test Cases' : 'Edit Test Case'}
        width="lg"
      >
        <Formik
          initialValues={testCaseInitialValue}
          validationSchema={editTestCaseValidation}
          // onSubmit={(values) => {
          //   console.log('values', values);
          //   handleEditTestCase({ formData: values });
          // }}
          onSubmit={(values) => {
            const formData = new FormData();

            // Append all form values
            Object.entries(values).forEach(([key, value]) => {
              formData.append(key, value);
            });

            // ✅ Append test_draft_id
            formData.append('test_draft_id', id); // <--- this line adds your `id` into FormData
            formData.append(
              'status_id',
              testCasesStatusDataList?.find(
                (d) => d.convention_name === 'PENDING'
              )?.id
            );
            // Now call the handler
            handleEditTestCase({ formData });
          }}
          // onSubmit={(values) => {
          //   console.log('values', values);
          //   handleEditTestCase({
          //     formData: {
          //       ...values,
          //       testing_group: values.testing_group?.map(
          //         (option) => option.label
          //       )
          //     }
          //   });
          // }}
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
                    id="edittestcasemodal_projectname"
                    placeholder="Select"
                    requiredField
                    handleChange={(event) =>
                      handleProjectChange(event, setFieldValue)
                    }
                  />
                </Col>

                <Col md={4} lg={4}>
                  <Field
                    classNamePrefix="react-select"
                    data={!moduleDropdown ? newModuleListData : moduleDropdown}
                    component={CustomDropdown}
                    name="module_id"
                    label="Module Name"
                    id="edittestcasemodal_modulename"
                    requiredField
                    placeholder="Select"
                    handleChange={(event) =>
                      handleModuleChange(event, setFieldValue)
                    }
                  />
                </Col>

                <Col md={4} lg={4}>
                  <Field
                    classNamePrefix="react-select"
                    data={subModuleDropdown}
                    component={CustomDropdown}
                    name="submodule_id"
                    label="SubModule Name"
                    id="edittestcasemodal_submodulename"
                    placeholder="Select"
                    // isMulti
                    requiredField
                  />
                </Col>

                <Col md={4} lg={4}>
                  <Field
                    classNamePrefix="react-select"
                    data={filterFunctionMasterList}
                    component={CustomDropdown}
                    name="function_id"
                    label="Function"
                    id="edittestcasemodal_function"
                    placeholder="Enter function name"
                    requiredField
                  />
                </Col>

                <Col md={4} lg={4}>
                  <Field
                    component={CustomInput}
                    name="field"
                    label="Field"
                    id="edittestcasemodal_field"
                    placeholder="Enter field name"
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    classNamePrefix="react-select"
                    data={filterTestingTypeMasterList}
                    component={CustomDropdown}
                    name="type_id"
                    label="Testing Type"
                    id="editestcasemodal_testingtype"
                    placeholder="Enter testing type name"
                    requiredField
                  />
                </Col>
                {/* <Col md={4} lg={4}> */}
                {/* <Field
                    component={CustomInput}
                    name="tc_id"
                    label="Test Id"
                    id="edittestcasemodal_testid"
                    placeholder="Enter testing id"
                    requiredField
                    disabled
                  /> */}
                {/* </Col> */}

                <Col md={4} lg={4}>
                  {/* <Field
                    classNamePrefix="react-select"
                    options={filterTestingGroupMasterList}
                    component={CustomReactSelect}
                    name="testing_group"
                    label="Testing Group"
                    isMulti
                    id="edittestcasemodal_testinggroup"
                  /> */}
                  <Field
                    classNamePrefix="react-select"
                    options={filterTestingGroupMasterList}
                    component={CustomReactSelect}
                    name="testing_group"
                    label="Testing Group"
                    id="edittestcasemodal_testinggroup"
                    placeholder="Select"
                    ref={testingGroupRef}
                    isMulti

                    // required
                  />
                  {/* <Field
                    classNamePrefix="react-select"
                    data={filterTestingGroupMasterList}
                    // component={CustomDropdown}
                    component={CustomReactSelect}
                    name="testing_group"
                    label="Testing Group"
                    id="edittestcasemodal_testinggroup"
                    isMulti={true}
                  /> */}
                  {/* {console.log(
                    'filterTestingGroupMasterList',
                    filterTestingGroupMasterList
                  )}
                  <Field
                    classNamePrefix="react-select"
                    // data={filterTestingGroupMasterList.map((item) => ({
                    //   label: item.name,
                    //   value: item.name
                    // }))}
                    data={filterTestingGroupMasterList}
                    component={CustomReactSelect}
                    name="testing_group"
                    label="Testing Group"
                    id="edittestcasemodal_testinggroup"
                    isMulti={true} // ✅ This is correct
                  /> */}
                </Col>

                <Col md={4} lg={4}>
                  <Field
                    classNamePrefix="react-select"
                    data={severityData}
                    component={CustomDropdown}
                    name="severity"
                    label="Severity"
                    id="edittestcasemodal_severity"
                    placeholder="Enter Severity"
                    requiredField
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    classNamePrefix="react-select"
                    data={automationScriptData}
                    component={CustomDropdown}
                    name="is_automation_script"
                    label="Automation Script"
                    id="is_automation_script"
                    placeholder="Enter Automation Script"
                    requiredField
                  />
                </Col>

                <Col md={4} lg={4}>
                  <Field
                    classNamePrefix="react-select"
                    data={getFilterReviewCommentMasterList}
                    component={CustomDropdown}
                    name="reviewer_comment_id"
                    label="Reviewer Comment Id"
                    id="reviewer_comment_id"
                    placeholder="Enter Reviewer Comment"
                    requiredField
                  />
                </Col>

                <Col md={6} lg={6}>
                  <Field
                    component={CustomTextArea}
                    name="steps"
                    label="Steps"
                    id="edittestcasemodal_steps"
                    placeholder="Enter steps"
                  />
                </Col>

                <Col md={6} lg={6}>
                  <Field
                    component={CustomTextArea}
                    name="test_description"
                    label="Test Description"
                    id="edittestcasemodal_testdescription"
                    placeholder="Enter test description"
                    requiredField
                  />
                </Col>

                <Col md={6} lg={6}>
                  <Field
                    component={CustomTextArea}
                    name="expected_result"
                    label="Expected Result"
                    id="edittestcasemodal_expectedresult"
                    placeholder="Enter expected result"
                    requiredField
                  />
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2">
                <button
                  // disabled={disable}
                  className="btn btn-primary px-4"
                  type="submit"
                >
                  {type === 'Add' ? 'Submit' : 'Update'}
                </button>
                <button
                  onClick={close}
                  className="btn btn-danger px-3"
                  type="button"
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

export default EditTestCaseModal;
