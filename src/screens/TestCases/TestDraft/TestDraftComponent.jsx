import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
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

  const [paginationData, setPaginationData] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    { rowPerPage: 10, currentPage: 1, currentFilterData: {} }
  );
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
    sessionStorage.removeItem('locationState');
  };

  const tabsLabel = [
    {
      label: 'Test summary',
      value: 'test_summary'
    },
    { label: 'Review Test Draft', value: 'review_test_draft' }
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
        }
      })
    );
  };

  const exportColumns = [
    { title: 'Module', field: 'module_name' },
    { title: 'Submodule', field: 'sub_module_name' },
    { title: 'Platform', field: 'platform' },
    { title: 'Function', field: 'function_name' },
    { title: 'Field', field: 'field' },
    { title: 'Testing Type', field: 'type_name' },
    { title: 'Testing Group', field: 'group_name' },
    { title: 'Test ID', field: 'tc_id' },
    { title: 'Test Description', field: 'test_description' },

    { title: 'Steps', field: 'steps' },
    { title: 'Expected Result', field: 'expected_result' },
    { title: 'Status', field: 'status' },
    { title: 'Project', field: 'project_name' },
    { title: 'Created At', field: 'created_at' },
    { title: 'Created By', field: 'created_by' },
    { title: 'Updated At', field: 'updated_at' },
    { title: 'Updated By', field: 'updated_by' }
  ];

  const exportReviewedColumns = [
    { title: 'Test Plan ID', field: 'test_plan_id' },
    { title: 'Reviewer Name', field: 'reviewer_name' },
    { title: 'Total Testcase', field: 'total_testcases' },
    { title: 'Reviewed Testcase', field: 'reviewed_testcases' },
    { title: 'Rejected Testcase', field: 'total_rejected' },
    { title: 'Approved Testcse', field: 'total_approved' },
    { title: 'Created At', field: 'created_at' },
    { title: 'Updated At', field: 'updated_at' }
  ];
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const handleButtonClick = () => {
    setClearData(true);

    setIsFilterApplied(false);
    currentTab === 'test_summary'
      ? dispatch(
          getDraftTestCaseList({
            limit: paginationData.rowPerPage,
            page: paginationData.currentPage,
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
  }, []);

  useEffect(() => {
    const savedState = sessionStorage.getItem('locationState');
    if (savedState) {
      setState(JSON.parse(savedState));
      sessionStorage.removeItem('locationState');
      window.history.replaceState(
        null,
        '',
        location.pathname + location.search
      );
    }
  }, [location]);

  useEffect(() => {
    if (location.state) {
      sessionStorage.setItem('locationState', JSON.stringify(location.state));
    }

    const handleBeforeUnload = (event) => {
      handleResetLocationState();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.state]);

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
              <ExportToExcel
                className="btn btn-danger"
                apiData={
                  currentTab === 'test_summary'
                    ? allDraftTestListData
                    : allReviewDraftTestListData
                }
                columns={
                  currentTab === 'test_summary'
                    ? exportColumns
                    : exportReviewedColumns
                }
                fileName={
                  currentTab === 'test_summary'
                    ? 'Test Summary Records'
                    : 'Review Test Draft Records'
                }
                disabled={
                  currentTab === 'review_test_draft' ||
                  allDraftTestListData?.length <= 0
                    ? true
                    : false
                }
              />
            </div>
          );
        }}
      />

      <div className="mt-3">
        <CustomTab
          tabsData={tabsLabel}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
      </div>
      <RenderIf render={currentTab === 'test_summary'}>
        <TestDraftDetails
          clearData={clearData}
          setClearData={setClearData}
          setIsFilterApplied={setIsFilterApplied}
          isFilterApplied={isFilterApplied}
        />
      </RenderIf>
      <RenderIf render={currentTab === 'review_test_draft'}>
        {currentTab === 'review_test_draft' && (
          <ReviewedTestDraftDetails
            clearData={clearData}
            setClearData={setClearData}
            setIsFilterApplied={setIsFilterApplied}
            isFilterApplied={isFilterApplied}
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
