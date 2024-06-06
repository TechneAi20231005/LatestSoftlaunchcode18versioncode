import React, { useEffect, useReducer, useState } from 'react';
import { Container, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { Astrick } from '../../../components/Utilities/Style';
import PageHeader from '../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import EditTestCaseModal from './EditTestCaseModal';
import DownloadFormatFileModal from './DownloadFormatFileModal';
import {
  getByTestPlanIDReviewedListThunk,
  getDraftTestCaseList,
  sendTestCaseReviewerThunk
} from '../../../redux/services/testCases/downloadFormatFile';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeData } from '../../Dashboard/DashboardAction';
import Select from 'react-select';
import { getReviewCommentMasterListThunk } from '../../../redux/services/testCases/reviewCommentMaster';

function ReviewedTestDraftComponent() {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { allReviewDraftTestListDataByID } = useSelector(
    (state) => state?.downloadFormat
  );

  const navigate = useNavigate();

  const [paginationData, setPaginationData] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    { rowPerPage: 10, currentPage: 1, currentFilterData: {} }
  );

  const { getFilterReviewCommentMasterList } = useSelector(
    (state) => state?.reviewCommentMaster
  );

  const generateOptions = (options) => {
    return options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ));
  };
  const [addEditTestCasesModal, setAddEditTestCasesModal] = useState({
    type: '',
    data: '',
    open: false
  });

  const [downloadmodal, setDownloadModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });

  const testerData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.getAllTesterDataList
  );
  const handleDownloadModal = (data) => {
    setDownloadModal(data);
  };
  const [selectAllNames, setSelectAllNames] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [reviewerId, setReviewerID] = useState();

  // Check if all rows are selected
  const [sendToReviewerModal, setSendToReviewerModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });

  const handleSendToReviewerModal = (currentData) => {
    setSendToReviewerModal(currentData);
  };

  const handleSelectAllNamesChange = () => {
    const newSelectAllNames = !selectAllNames;
    setSelectAllNames(newSelectAllNames);
    if (newSelectAllNames) {
      const draftRowIds = allReviewDraftTestListDataByID.map((row) => row.id);
      setSelectedRows(draftRowIds);
    } else {
      setSelectedRows([]);
    }
  };

  // Handles individual checkbox change
  const handleCheckboxChange = (row) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(row.id)) {
        return prevSelectedRows.filter((selectedRow) => selectedRow !== row.id);
      } else {
        return [...prevSelectedRows, row.id];
      }
    });
  };

  const columns = [
    {
      name: 'Action',
      selector: (row) => (
        <>
          <i
            className="icofont-edit text-primary cp me-3"
            onClick={() =>
              setAddEditTestCasesModal({
                type: 'EDIT',
                data: row,
                open: true
              })
            }
          />

          <i class="icofont-history cp bg-warning rounded-circle" />
        </>
      ),
      sortable: false,
      width: '90px'
    },

    {
      name: (
        <div onClick={handleSelectAllNamesChange}>
          <input
            type="checkbox"
            checked={selectAllNames}
            onChange={handleSelectAllNamesChange}
          />
        </div>
      ),
      selector: 'selectAll',
      center: true,
      cell: (row) => (
        <div>
          <input
            type="checkbox"
            checked={selectedRows.includes(row.id)}
            onChange={() => handleCheckboxChange(row)}
          />
        </div>
      )
    },

    {
      name: 'Module',
      selector: (row) => row.module_name,
      sortable: false,
      width: '100px'
    },

    {
      name: 'Submodule',
      selector: (row) => row.sub_module_name,
      sortable: false,
      width: '100px'
    },
    {
      name: 'Function',
      selector: (row) => row.function_name,
      sortable: false,
      width: '100px'
    },
    {
      name: 'field',
      selector: (row) => row.field,
      sortable: false,
      width: '100px'
    },
    {
      name: 'Testing Type',
      selector: (row) => row.type_name,
      sortable: false,
      width: '100px'
    },

    {
      name: 'Testing Group',
      selector: (row) => row.group_name,
      sortable: false,
      width: '100px'
    },

    {
      name: 'Test ID',
      selector: (row) => row.id,
      sortable: false,
      width: '100px'
    },
    {
      name: 'Severity',
      selector: (row) => row.severity,
      sortable: false,
      width: '100px'
    },

    {
      name: 'Test Description',
      selector: (row) => row.test_description,
      sortable: false,
      width: '100px'
    },
    {
      name: 'Steps',
      selector: (row) => row.steps,
      sortable: false,
      width: '100px'
    },

    {
      name: 'Expected Result',
      selector: (row) => row.expected_result,
      sortable: false,
      width: '100px'
    },

    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: false,
      width: '100px'
    },

    {
      name: 'Reviewer comment',
      selector: (row) => row?.comment_id,
      sortable: true,

      width: '250px',
      cell: (row) => (
        <select
          className="form-select"
          aria-label="Default select example"
          value={row.comment_id || ''}
          id="comment_id"
          name="comment_id"
          disabled
        >
          {generateOptions(getFilterReviewCommentMasterList)}
        </select>
      )
    },
    {
      name: 'Remark',
      selector: (row) => row?.remark,
      sortable: true,
      width: '300px',
      cell: (row) => (
        <input
          className="form-control"
          type="text"
          id="other_remark"
          name="other_remark"
          placeholder="Enter Remark"
          aria-label="default input example"
          defaultValue={row.other_remark}
          disabled
        />
      )
    },
    {
      name: 'Project',
      selector: (row) => row.project_name,
      sortable: false,
      width: '100px'
    },

    {
      name: 'Created At',
      selector: (row) => row.created_at,
      sortable: false,
      width: '100px'
    },

    {
      name: 'Created By',
      selector: (row) => row.created_by,
      sortable: false,
      width: '100px'
    }
  ];

  const exportColumns = [
    { title: 'Module', field: 'module_name' },
    { title: 'Submodule', field: 'sub_module_name' },
    { title: 'Function', field: 'function_name' },
    { title: 'Field', field: 'field' },
    { title: 'Testing Type', field: 'type_name' },
    { title: 'Testing Group', field: 'group_name' },
    { title: 'Steps', field: 'steps' },
    { title: 'Severity', field: 'severity' },
    { title: 'Expected Result', field: 'expected_result' },
    { title: 'Status', field: 'status' },
    { title: 'Project', field: 'project_name' },
    { title: 'Created At', field: 'created_at' },
    { title: 'Created By', field: 'created_by' },
    { title: 'Updated At', field: 'updated_at' },
    { title: 'Updated By', field: 'updated_by' }
  ];
  const handleSubmit = () => {
    const formData = {
      testcase_id: selectedRows,
      reviewer_id: reviewerId
    };

    dispatch(
      sendTestCaseReviewerThunk({
        formData,
        type: 'RESEND',
        id: id,
        onSuccessHandler: () => {
          setSendToReviewerModal({ showModal: false });
          setSelectedRows([]);
          setSelectAllNames(false);
          dispatch(
            getDraftTestCaseList({
              limit: paginationData.rowPerPage,
              page: paginationData.currentPage
            })
          );
          dispatch(
            getByTestPlanIDReviewedListThunk({
              id: id,
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
    dispatch(getEmployeeData());
    dispatch(getReviewCommentMasterListThunk());

    dispatch(
      getByTestPlanIDReviewedListThunk({
        id: id,
        limit: paginationData.rowPerPage,
        page: paginationData.currentPage
      })
    );
  }, [paginationData.rowPerPage, paginationData.currentPage]);

  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Test Draft"
        renderRight={() => {
          return (
            <div className="col-md-6 d-flex justify-content-end">
              <button className="btn btn-primary text-white ">
                Filter <i className="icofont-filter" />
              </button>
              <button
                className="btn btn btn-set-task w-sm-100 bg-success text-white"
                onClick={(e) => {
                  handleDownloadModal({
                    showModal: true,
                    modalData: '', // You can add relevant data here
                    modalHeader: 'Edit Test Case '
                  });
                }}
              >
                Download Format File
              </button>
              <button className="btn btn-warning btn-set-task w-sm-100 ">
                Import Test Draft File
              </button>
              <ExportToExcel
                className="btn btn-sm btn-danger "
                apiData={allReviewDraftTestListDataByID}
                columns={exportColumns}
                fileName="Reviewed Test Draft List"
              />
            </div>
          );
        }}
      />
      <Container fluid className="employee_joining_details_container">
        <h5 className="mb-0 text-primary">Test Cases</h5>
        <hr className="primary_divider mt-1" />
        <DataTable
          columns={columns}
          data={allReviewDraftTestListDataByID}
          defaultSortField="role_id"
          pagination
          selectableRows={false}
          paginationServer
          paginationTotalRows={
            allReviewDraftTestListDataByID?.total?.total_count
          }
          paginationDefaultPage={paginationData.currentPage}
          onChangePage={(page) => setPaginationData({ currentPage: page })}
          onChangeRowsPerPage={(newPageSize) => {
            setPaginationData({ rowPerPage: newPageSize });
            setPaginationData({ currentPage: 1 });
          }}
          paginationRowsPerPageOptions={[10, 15, 20, 25, 30]}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
        />
      </Container>

      <div className="d-flex justify-content-end mt-3">
        <button
          onClick={() =>
            navigate(`/${_base}/TestDraft`, { state: 'review_test_draft' })
          }
          className="btn btn-primary text-white"
        >
          Back
        </button>

        <button
          onClick={() => {
            handleSendToReviewerModal({
              showModal: true,
              modalData: '',
              modalHeader: 'Send To Reviewer Modal'
            });
          }}
          type="submit"
          className="btn btn-sm btn bg-success text-white"
        >
          <i class="icofont-paper-plane"></i> {''}
          Send To Reviewer
        </button>
      </div>
      {downloadmodal.showModal === true && (
        <DownloadFormatFileModal
          show={downloadmodal}
          close={() => setDownloadModal(false)}
        />
      )}

      {addEditTestCasesModal.open === true && (
        <EditTestCaseModal
          show={addEditTestCasesModal?.open}
          type={addEditTestCasesModal?.type}
          currentTestCasesData={addEditTestCasesModal?.data}
          close={(prev) => setAddEditTestCasesModal({ ...prev, open: false })}
          paginationData={paginationData}
          id={id}
        />
      )}

      <Modal
        centered
        show={sendToReviewerModal.showModal}
        size="sm"
        onHide={(e) => {
          handleSendToReviewerModal({
            showModal: true,
            modalData: '',
            modalHeader: 'Send To Reviewer Modal'
          });
        }}
      >
        {' '}
        <Modal.Body>
          <label>
            <b>
              Reviewer : <Astrick color="red" size="13px" />
            </b>
          </label>
          <Select
            type="text"
            className="form-control form-control-sm"
            id="reviewer_id"
            name="reviewer_id"
            options={testerData}
            onChange={(e) => {
              const selectedId = e?.value;
              setReviewerID(selectedId);
            }}
            placeholder="select..."
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            type="submit"
            className="btn btn-sm btn bg-success text-white"
            onClick={() => handleSubmit()}
          >
            <i class="icofont-paper-plane "></i> {''}
            Send To Reviewer
          </button>

          <button
            type="button"
            className="btn btn bg-white shadow p-2 text-black"
            onClick={() => {
              handleSendToReviewerModal({
                showModal: false,
                modalData: '',
                modalHeader: 'Send To Reviewer Modal'
              });
            }}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReviewedTestDraftComponent;
