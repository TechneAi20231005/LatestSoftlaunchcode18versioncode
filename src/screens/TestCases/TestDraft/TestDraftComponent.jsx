import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Modal, PageItem } from 'react-bootstrap';
import { Astrick } from '../../../components/Utilities/Style';
import DownloadFormatFileModal from './DownloadFormatFileModal';
import ReviewedTestDraftDetails from './ReviewedTestDraftDetails';
import CustomTab from '../../../components/custom/tabs/CustomTab';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportDataFile';
import { RenderIf } from '../../../utils';
import PageHeader from '../../../components/Common/PageHeader';
import TestDraftDetails from './TestDraftDetails';
import {
  getAllDraftTestCaseList,
  getAllReviewTestDraftList,
  getDraftTestCaseList,
  getModuleMasterThunk,
  getProjectModuleMasterThunk,
  getSubModuleMasterThunk,
  importTestDraftThunk
} from '../../../redux/services/testCases/downloadFormatFile';
import { getEmployeeData } from '../../Dashboard/DashboardAction';
import { Icon, Tab, Tabs } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import PreviewIcon from '@mui/icons-material/Preview';
export default function TestDraftComponent({}) {
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    allDraftTestListData,
    allReviewDraftTestListData,
    filterData,
    filterReviewedDraftTestList
  } = useSelector((state) => state?.downloadFormat);
  const [currentTab, setCurrentTab] = useState(
    location.state ?? 'test_summary'
  );
  const [state, setState] = useState(location.state);

  // const [paginationData, setPaginationData] = useReducer(
  //   (prevState, nextState) => {
  //     return { ...prevState, ...nextState };
  //   },
  //   { rowPerPage: 10, currentPage: 1, currentFilterData: {} }
  // );

  const [paginationData, setPaginationData] = useState({
    pageIndex: 0,
    pageSize: 100
  });

  const [downloadmodal, setDownloadModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });

  const [bulkModal, setBulkModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });

  const [clearData, setClearData] = useState(false);
  const handleResetLocationState = () => {
    setState(null);
    localStorage.removeItem('locationState');
  };

  const tabsLabel = [
    {
      label: 'Test summary',
      value: 'test_summary',
      Icon: <DescriptionIcon />
    },
    {
      label: 'Review Test Draft',
      value: 'review_test_draft',
      Icon: <PreviewIcon />
    }
  ];

  const handleDownloadModal = (data) => {
    setDownloadModal(data);
  };

  const handleBulkModal = (data) => {
    setBulkModal(data);
    setDisable(false);
  };

  const [disable, setDisable] = useState(false);

  const handleBulkUpload = (e) => {
    setDisable(true);
    e.preventDefault();
    const file = e.target.elements.file_attachment.files[0]; // Access the file from the event target

    if (!file) {
      alert('Please choose a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file_attachment', file);
    dispatch(
      importTestDraftThunk({
        formData,
        onSuccessHandler: () => {
          setBulkModal({ showModal: false });
          setDisable(false);

          dispatch(
            getDraftTestCaseList({
              limit: paginationData.rowPerPage,
              page: paginationData.currentPage
            })
          );
        },
        onErrorHandler: () => {
          setBulkModal({ showModal: false });
          dispatch(
            getDraftTestCaseList({
              limit: paginationData.rowPerPage,
              page: paginationData.currentPage
            })
          );
        }
      })
    );
  };

  const transformDataForDraft = (data) => {
    return data?.length > 0 && data?.map((originalRows) => ({
      Module: originalRows?.module?.module_name,
      Submodule: originalRows?.sub_module?.sub_module_name,
      Platform: originalRows?.platform || '-',
      Function: originalRows?.function_master?.function_name || '-',
      Field: originalRows?.field,
      'Testing Type': originalRows?.testing_type?.type_name || '-',
      'Testing Group': originalRows?.testing_group || '-',
      'Test ID': originalRows?.tc_id || '-',
      'Test Description': originalRows?.test_description || '-',
      Severity: originalRows?.severity || '-',
      Steps: originalRows?.steps || '-',
      'Expected Result': originalRows?.expected_result || '-',
      Status: originalRows?.tai_bc_status_conventions?.convention_name || '-',
      Project: originalRows?.project?.project_name || '-',
      'is Automation': originalRows?.is_automation_script || '-',
      'Created At': originalRows?.created_at || '-',
      'Created By': `${originalRows?.created_by?.first_name || '-'} ${
        originalRows?.created_by?.last_name || '-'
      }`,
      'Updated At': originalRows?.updated_at || '-',
      'Updated By': `${originalRows?.updated_by?.first_name || '-'} ${
        originalRows?.updated_by?.last_name || '-'
      }`
    }));
  };

  const transformDataForReviewer = (data) => {
    return data?.length > 0 && data?.map((originalRows) => ({

      "Test Plan ID": originalRows?.test_plan_id || '-',
      "Reviewer Name": `${originalRows.reviewer_name?.first_name || '-'} ${originalRows.reviewer_name?.last_name || '-'} `,
      "Total Testcase": originalRows?.total_testcases,
      "Reviewed Testcase": originalRows?.total_reviewed_testcases,
      "Rejected Testcase": originalRows?.total_rejected_testcases,
      "Approved Testcase": originalRows?.total_approved_testcase,
      'is Automation': originalRows?.is_automation_script || '-',
      'Created At': originalRows?.created_at || '-',
      'Created By': `${originalRows?.created_by?.first_name || '-'} ${
        originalRows?.created_by?.last_name || '-'
      }`,
      'Updated At': originalRows?.updated_at || '-',
      'Updated By': `${originalRows?.updated_by?.first_name || '-'} ${
        originalRows?.updated_by?.last_name || '-'
      }`
    }));
  };

  const exportColumns = [
    { title: 'Module', field: 'Module' },
    { title: 'Submodule', field: 'Submodule' },
    { title: 'Platform', field: 'Platform' },
    { title: 'Function', field: 'Function' },
    { title: 'Field', field: 'Field' },
    { title: 'Testing Type', field: 'Testing Type' },
    { title: 'Testing Group', field: 'Testing Group' },
    { title: 'Test ID', field: 'Test ID' },
    { title: 'Test Description', field: 'Test Description' },
    { title: 'Severity', field: 'Severity' },

    { title: 'Steps', field: 'Steps' },
    { title: 'Expected Result', field: 'Expected Result' },
    { title: 'Status', field: 'Status' },
    { title: 'Project', field: 'Project' },
     { title: 'is Automation', field: 'is Automation' },
    { title: 'Created At', field: 'Created At' },
    { title: 'Created By', field: 'Created By' },
    { title: 'Updated At', field: 'Updated At' },
    { title: 'Updated By', field: 'Updated By' }
  ];

  const exportReviewedColumns = [
    { title: 'Test Plan ID', field: 'Test Plan ID' },
    { title: 'Reviewer Name', field: 'Reviewer Name' },
    { title: 'Total Testcase', field: 'Total Testcase' },
    { title: 'Reviewed Testcase', field: 'Reviewed Testcase' },
    { title: 'Rejected Testcase', field: 'Rejected Testcase' },
    { title: 'Approved Testcase', field: 'Approved Testcase' },
     { title: 'is Automation', field: 'is Automation' },
    { title: 'Created At', field: 'Created At' },
    { title: 'Created By', field: 'Created By' },

    { title: 'Updated At', field: 'Updated At' },
    { title: 'Updated By', field: 'Updated By' }
  ];
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const handleButtonClick = () => {
    setClearData(true);

    setIsFilterApplied(false);

    // setPaginationData({
    //   rowPerPage: 10,
    //   currentPage: 1
    // });
    setPaginationData({
      pageSize: 100,
      pageIndex: 0
    });
    currentTab === 'test_summary'
      ? dispatch(
          getDraftTestCaseList({
            limit: 10,
            page: 1,
            filter_testcase_data: []
          })
        )
      : dispatch(
          getAllReviewTestDraftList({
            limit: paginationData.rowPerPage,
            page: paginationData.currentPage,
            filter_testcase_data: []
          })
        );
  };

  useEffect(() => {
    dispatch(getProjectModuleMasterThunk());
    dispatch(getModuleMasterThunk());
    dispatch(getSubModuleMasterThunk());
    dispatch(importTestDraftThunk());
    dispatch(
      getAllDraftTestCaseList({
        type: 'ALL'
      })
    );
    dispatch(getEmployeeData());
  }, []);

  useEffect(() => {
    const savedState = localStorage.getItem('locationState');
    if (savedState) {
      setState(JSON.parse(savedState));
      localStorage.removeItem('locationState');
      window.history.replaceState(
        null,
        '',
        location.pathname + location.search
      );
    }
  }, [location]);

  useEffect(() => {
    if (location.state) {
      localStorage.setItem('locationState', JSON.stringify(location.state));
    }

    const handleBeforeUnload = (event) => {
      handleResetLocationState();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.state]);

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  const tabStyles = {
    '& .MuiTabs-indicator': { backgroundColor: '#484c7f' },
    '& .MuiTab-root.Mui-selected': { color: '#484c7f' }
  };
  console.log('allDraftTestListData', allDraftTestListData);
  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Test Draft"
        renderRight={() => {
          return (
            <div className="d-flex justify-content-sm-end btn_container">
              {currentTab === 'test_summary' ? (
                <button
                  onClick={handleButtonClick}
                  className="btn btn-primary text-white me-2"
                  disabled={filterData?.payload === 'null'}
                >
                  Clear All Filter
                </button>
              ) : (
                <button
                  onClick={handleButtonClick}
                  className="btn btn-primary text-white me-2"
                  disabled={filterReviewedDraftTestList?.payload === 'null'}
                >
                  Clear All Filter
                </button>
              )}

              <button
                className="btn btn-success text-white me-2 "
                onClick={(e) => {
                  handleDownloadModal({
                    showModal: true,
                    modalData: '',
                    modalHeader: 'Edit Test Case'
                  });
                }}
              >
                Download Format File
              </button>
              <button
                onClick={() => {
                  handleBulkModal({
                    showModal: true,
                    modalData: '',
                    modalHeader: 'Bulk Upload Vendor'
                  });
                }}
                className="btn btn-warning text-white "
              >
                Import Test Draft File
              </button>
              {currentTab === 'test_summary' && (
                <ExportToExcel
                  className="btn btn-danger"
                  apiData={transformDataForDraft(allDraftTestListData)}
                  columns={exportColumns}
                  fileName={'Test Summary Records'}
                  disabled={allDraftTestListData?.length <= 0 ? true : false}
                />
              )}

              {currentTab === 'review_test_draft' && (
                <ExportToExcel
                  className="btn btn-danger"
                  apiData={transformDataForReviewer(allReviewDraftTestListData)}
                  columns={exportReviewedColumns}
                  fileName={'Review Test Draft Records'}
                  disabled={
                    allReviewDraftTestListData?.length <= 0 ? true : false
                  }
                />
              )}
            </div>
          );
        }}
      />

      <div className="mt-3">
        <Tabs sx={tabStyles} value={currentTab} onChange={handleChange}>
          {tabsLabel.map((tab) => (
            <Tab
              icon={tab.Icon}
              key={tab.value}
              label={tab.label}
              value={tab.value}
            />
          ))}
        </Tabs>
        {/* <CustomTab
          tabsData={tabsLabel}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        /> */}
      </div>
      <RenderIf render={currentTab === 'test_summary'}>
        <TestDraftDetails
          clearData={clearData}
          setClearData={setClearData}
          setIsFilterApplied={setIsFilterApplied}
          isFilterApplied={isFilterApplied}
          setPaginationData={setPaginationData}
          paginationData={paginationData}
        />
      </RenderIf>
      <RenderIf render={currentTab === 'review_test_draft'}>
        {currentTab === 'review_test_draft' && (
          <ReviewedTestDraftDetails
            clearData={clearData}
            setClearData={setClearData}
            setIsFilterApplied={setIsFilterApplied}
            isFilterApplied={isFilterApplied}
            setPaginationData={setPaginationData}
            paginationData={paginationData}
          />
        )}
      </RenderIf>

      {downloadmodal.showModal === true && (
        <DownloadFormatFileModal
          show={downloadmodal}
          close={() => setDownloadModal(false)}
        />
      )}

      <Modal
        centered
        show={bulkModal.showModal}
        size="sm"
        onHide={(e) => {
          handleBulkModal({
            showModal: false,
            modalData: '',
            modalHeader: ''
          });
        }}
      >
        {' '}
        <Modal.Header>
          <Modal.Title className="fw-bold"></Modal.Title>
        </Modal.Header>
        <form method="post" onSubmit={handleBulkUpload}>
          <Modal.Body>
            <div className="deadline-form">
              <div className="row ">
                <label className="form-label font-weight-bold">
                  Upload Excel/CSV File:
                  <Astrick color="red" size="13px" />
                </label>
                <input
                  type="file"
                  name="file_attachment"
                  id="file_attachment"
                  accept=".xlsx, .xls, .csv"
                  className="form-control"
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="submit"
              className="btn btn-primary text-white"
              style={{ backgroundColor: '#484C7F' }}
              disabled={disable}
              onClick={() => {
                handleBulkModal({
                  showModal: true,
                  modalData: '',
                  modalHeader: 'Bulk Upload Test Draft'
                });
              }}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-danger text-white"
              onClick={() => {
                handleBulkModal({
                  showModal: false,
                  modalData: '',
                  modalHeader: ''
                });
              }}
            >
              Close
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}
