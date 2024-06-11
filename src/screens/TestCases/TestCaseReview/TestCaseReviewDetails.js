import React, { useEffect, useReducer, useState } from 'react';
import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { Astrick } from '../../../components/Utilities/Style';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PageHeader from '../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportDataFile';
import { _base } from '../../../settings/constants';
import {
  approveRejectByReviewerMasterThunk,
  getByTestPlanIDListThunk
} from '../../../redux/services/testCases/testCaseReview';
import { getReviewCommentMasterListThunk } from '../../../redux/services/testCases/reviewCommentMaster';
import EditTestCaseModal from '../TestDraft/EditTestCaseModal';
function TestCaseReviewDetails() {
  const { id } = useParams();
  const planID = id;
  const dispatch = useDispatch();

  const [paginationData, setPaginationData] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    { rowPerPage: 10, currentPage: 1, currentFilterData: {} }
  );
  const { testPlanIdData, allTestPlanIDData } = useSelector(
    (state) => state?.testCaseReview
  );

  const { getFilterReviewCommentMasterList } = useSelector(
    (state) => state?.reviewCommentMaster
  );

  const [selectAllNames, setSelectAllNames] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const [rowData, setRowData] = useState([]);
  const [commonComment, setCommonComment] = useState('');
  const [commonRemark, setCommonRemark] = useState('');
  const [addEditTestCasesModal, setAddEditTestCasesModal] = useState({
    type: '',
    data: '',
    open: false
  });

  const generateOptions = (options) => {
    return [
      <option key="default" value="" disabled>
        Select Reviewer comment
      </option>,
      ...options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))
    ];
  };
  const handleSelectAllNamesChange = () => {
    const newSelectAllNames = !selectAllNames;
    setSelectAllNames(newSelectAllNames);
    if (newSelectAllNames) {
      const allRowIds = rowData.map((row) => row.id);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleCheckboxChange = (row) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(row.id)) {
        return prevSelectedRows.filter((selectedRow) => selectedRow !== row.id);
      } else {
        return [...prevSelectedRows, row.id];
      }
    });
  };

  const handleRowChange = (id, field, value) => {
    setRowData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleSubmit = async (status) => {
    // Create the payload

    const updatedRows = rowData
      .filter((row) => selectedRows.includes(row.id))
      .map((row) => ({
        id: row.id,
        comment_id: row.comment_id !== '' ? row.comment_id : '',
        other_remark: row.other_remark !== '' ? row.other_remark : ''
      }));
    const formData = {
      review_testcase_data: updatedRows,
      status: status, // Adjust as necessary
      common_comment_id: commonComment,
      common_remark: commonRemark
    };
    dispatch(
      approveRejectByReviewerMasterThunk({
        formData,

        onSuccessHandler: () => {
          setCommonComment('');
          setCommonRemark('');
          dispatch(
            getByTestPlanIDListThunk({
              id: id,
              limit: paginationData.rowPerPage,
              page: paginationData.currentPage
            })
          );
          setRowData(testPlanIdData);
        },
        onErrorHandler: () => {}
      })
    );
  };

  useEffect(() => {
    if (testPlanIdData) {
      setRowData(testPlanIdData);
    }
  }, [testPlanIdData]);

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
      width: '10rem',
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.module_name && (
            <OverlayTrigger overlay={<Tooltip>{row.module_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.module_name && row.module_name.length < 20
                    ? row.module_name
                    : row.module_name.substring(0, 50) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Submodule',
      selector: (row) => row.sub_module_name,
      width: '10rem',
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.sub_module_name && (
            <OverlayTrigger overlay={<Tooltip>{row.sub_module_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.sub_module_name && row.sub_module_name.length < 20
                    ? row.sub_module_name
                    : row.sub_module_name.substring(0, 50) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Function',
      selector: (row) => row.function_name,
      width: '7rem',
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.function_name && (
            <OverlayTrigger overlay={<Tooltip>{row.function_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.function_name && row.function_name.length < 20
                    ? row.function_name
                    : row.function_name.substring(0, 50) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Field',
      selector: (row) => row.field,
      width: '7rem',
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.field && (
            <OverlayTrigger overlay={<Tooltip>{row.field} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.field && row.field.length < 20
                    ? row.field
                    : row.field.substring(0, 50) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Testing Type',
      selector: (row) => row.type_name,
      width: '10rem',
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.type_name && (
            <OverlayTrigger overlay={<Tooltip>{row.type_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.type_name && row.type_name.length < 20
                    ? row.type_name
                    : row.type_name.substring(0, 50) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Testing Group',
      selector: (row) => row.group_name,
      width: '10rem',
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.group_name && (
            <OverlayTrigger overlay={<Tooltip>{row.group_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.group_name && row.type_name.length < 20
                    ? row.group_name
                    : row.group_name.substring(0, 50) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
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
      width: '10rem',
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.test_description && (
            <OverlayTrigger
              overlay={<Tooltip>{row.test_description} </Tooltip>}
            >
              <div>
                <span className="ms-1">
                  {' '}
                  {row.test_description && row.test_description.length < 20
                    ? row.test_description
                    : row.test_description.substring(0, 50) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Steps',
      selector: (row) => row.steps,
      width: '10rem',
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.steps && (
            <OverlayTrigger overlay={<Tooltip>{row.steps} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.steps && row.steps.length < 20
                    ? row.steps
                    : row.steps.substring(0, 50) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Expected Result',
      selector: (row) => row.expected_result,
      width: '10rem',
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.expected_result && (
            <OverlayTrigger overlay={<Tooltip>{row.expected_result} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.expected_result && row.expected_result.length < 20
                    ? row.expected_result
                    : row.expected_result.substring(0, 50) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
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
          onChange={(e) =>
            handleRowChange(row.id, 'comment_id', e.target.value)
          }
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
          onChange={(e) =>
            handleRowChange(row.id, 'other_remark', e.target.value)
          }
        />
      )
    },
    {
      name: 'Project',
      selector: (row) => row.project_name,
      width: '10rem',
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.project_name && (
            <OverlayTrigger overlay={<Tooltip>{row.project_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.project_name && row.project_name.length < 20
                    ? row.project_name
                    : row.project_name.substring(0, 50) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Created At',
      selector: (row) => row.created_at,
      width: '7rem',
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.created_at && (
            <OverlayTrigger overlay={<Tooltip>{row.created_at} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.created_at && row.created_at.length < 20
                    ? row.created_at
                    : row.created_at.substring(0, 50) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Created By',
      selector: (row) => row.created_by,
      width: '7rem',
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.created_by && (
            <OverlayTrigger overlay={<Tooltip>{row.created_by} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.created_by && row.created_by.length < 20
                    ? row.created_by
                    : row.created_by.substring(0, 50) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
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

  useEffect(() => {
    dispatch(
      getByTestPlanIDListThunk({
        id: id,
        limit: paginationData.rowPerPage,
        page: paginationData.currentPage
      })
    );
    dispatch(getReviewCommentMasterListThunk());
  }, [paginationData.rowPerPage, paginationData.currentPage]);

  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Test Case Review"
        renderRight={() => {
          return (
            <div className="col-md-6 d-flex justify-content-end">
              <ExportToExcel
                className="btn btn-sm btn-danger "
                fileName="Test Case Review List"
                apiData={testPlanIdData}
                columns={exportColumns}
              />
            </div>
          );
        }}
      />
      <Container fluid className="employee_joining_details_container">
        <h5 className="mb-0 text-primary">Test Cases</h5>
        <hr className="primary_divider " />
        <DataTable
          columns={columns}
          data={rowData}
          defaultSortField="role_id"
          pagination
          paginationServer
          paginationTotalRows={allTestPlanIDData?.total}
          paginationDefaultPage={rowData?.currentPage}
          onChangePage={(page) => setPaginationData({ currentPage: page })}
          onChangeRowsPerPage={(newPageSize) => {
            setPaginationData({ rowPerPage: newPageSize });
            setPaginationData({ currentPage: 1 });
          }}
          paginationRowsPerPageOptions={[
            50, 100, 150, 200, 300, 500, 700, 1000
          ]}
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
        />
      </Container>

      <div className="row mt-4">
        <div className="col-md-3">
          <label className="form-label font-weight-bold">
            Content Type :<Astrick color="red" size="13px" />{' '}
          </label>

          <select
            className="form-select"
            value={commonComment}
            id="common_comment_id"
            name="common_comment_id"
            onChange={(e) => setCommonComment(e.target.value)}
          >
            {generateOptions(getFilterReviewCommentMasterList)}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label font-weight-bold">Remark :</label>
          <input
            className="form-control"
            id="common_remark"
            name="common_remark"
            value={commonRemark}
            onChange={(e) => setCommonRemark(e.target.value)}
          />
        </div>
      </div>

      <div className=" d-flex  justify-content-end">
        <button
          type="submit"
          onClick={() => handleSubmit('RESEND')}
          className="btn btn-sm btn-warning text-white"
        >
          <i class="icofont-paper-plane icon-large mx-2"></i>
          Send For Modification
        </button>
        <button
          onClick={() => handleSubmit('REJECTED')}
          type="submit"
          className="btn btn-lg btn-danger text-white "
        >
          Reject
        </button>

        <button
          type="submit"
          className="btn btn-lg  btn-success  text-white "
          onClick={() => handleSubmit('APPROVED')}
        >
          Approve
        </button>
      </div>
      {addEditTestCasesModal.open === true && (
        <EditTestCaseModal
          show={addEditTestCasesModal?.open}
          type={addEditTestCasesModal?.type}
          currentTestCasesData={addEditTestCasesModal?.data}
          close={(prev) => setAddEditTestCasesModal({ ...prev, open: false })}
          paginationData={paginationData}
          id={planID}
          payloadType={'TestCaseReview'}
        />
      )}
    </div>
  );
}

export default TestCaseReviewDetails;
