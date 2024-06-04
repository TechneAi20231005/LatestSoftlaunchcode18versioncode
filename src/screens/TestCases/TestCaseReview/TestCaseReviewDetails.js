import React, { useEffect, useReducer, useState } from 'react';
import { Container } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { Astrick } from '../../../components/Utilities/Style';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Modal, Form } from 'react-bootstrap';
import PageHeader from '../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';
import { _base } from '../../../settings/constants';
import {
  approveRejectByReviewerMasterThunk,
  getByTestPlanIDListThunk
} from '../../../redux/services/testCases/testCaseReview';
import { getReviewCommentMasterListThunk } from '../../../redux/services/testCases/reviewCommentMaster';
import EditTestCaseModal from '../TestDraft/EditTestCaseModal';
function TestCaseReviewDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [modal, setModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });
  const [paginationData, setPaginationData] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    { rowPerPage: 10, currentPage: 1, currentFilterData: {} }
  );
  const { testPlanIdData } = useSelector((state) => state?.testCaseReview);

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

  const [rowData, setRowData] = useState([]);
  const [commonComment, setCommonComment] = useState('');
  const [commonRemark, setCommonRemark] = useState('');

  const handleRowChange = (id, field, value) => {
    const testPlanIdList = testPlanIdData;
    const testD = testPlanIdList?.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    // setRowData((prevData) =>
    //   prevData.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    // );
    // setRowData(testD);
  };

  const [addEditTestCasesModal, setAddEditTestCasesModal] = useState({
    type: '',
    data: '',
    open: false
  });

  const handleSubmit = async (status) => {
    const updatedRows = rowData.map((row) => ({
      id: row.id,
      comment_id: row.comment_id !== '' ? row.comment_id : '',
      other_remark: row.other_remark !== '' ? row.other_remark : ''
    }));

    // Create the payload
    const formData = {
      review_testcase_data: updatedRows,
      status: status, // Adjust as necessary
      common_comment_id: commonComment,
      common_remark: commonRemark
    };

    dispatch(
      approveRejectByReviewerMasterThunk({
        formData,

        onSuccessHandler: () => {},
        onErrorHandler: () => {}
      })
    );
  };

  const handleModal = (data) => {
    setModal(data);
  };

  const columns = [
    {
      name: 'Action',
      selector: (row) => (
        <>
          <i
            // disabled={row.status != 'DRAFT'}
            // className="icofont-edit text-primary cp me-3"
            // className={`icofont-edit text-primary cp me-3 ${
            //   row.status !== 'DRAFT' ? 'disabled-icon' : ''
            // }`}
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
        <div className="d-flex">
          <input type="checkbox" />
        </div>
      ),
      selector: 'selectAll',
      width: '5rem',
      center: true,
      cell: (row) => (
        <div>
          <input type="checkbox" />
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

    // {
    //   name: 'Reviewer comment',
    //   selector: (row) => row?.name,
    //   sortable: true,
    //   width: '250px',
    //   cell: (row) => (
    //     <select
    //       className="form-select"
    //       aria-label="Default select example"
    //       value={row.comment_id || ''}
    //       id="comment_id"
    //       name="comment_id"
    //       onChange={(e) =>
    //         handleRowChange(row.id, 'comment_id', e.target.value)
    //       }
    //     >
    //       {generateOptions(getFilterReviewCommentMasterList)}
    //     </select>
    //   )
    // },

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
          // value={row.other_remark || ''}
          onChange={(e) =>
            handleRowChange(row.id, 'other_remark', e.target.value)
          }
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

  // const exportColumns = [
  //   { title: 'Module', field: 'module_name' },
  //   { title: 'Submodule', field: 'sub_module_name' },
  //   { title: 'Function', field: 'function_name' },
  //   { title: 'Field', field: 'field' },
  //   { title: 'Testing Type', field: 'type_name' },
  //   { title: 'Testing Group', field: 'group_name' },
  //   { title: 'Steps', field: 'steps' },
  //   { title: 'Severity', field: 'severity' },
  //   { title: 'Expected Result', field: 'expected_result' },
  //   { title: 'Status', field: 'status' },
  //   { title: 'Project', field: 'project_name' },
  //   { title: 'Created At', field: 'created_at' },
  //   { title: 'Created By', field: 'created_by' },
  //   { title: 'Updated At', field: 'updated_at' },
  //   { title: 'Updated By', field: 'updated_by' }
  // ];

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
              <button className="btn btn-primary text-white c">
                Filter <i className="icofont-filter" />
              </button>

              <ExportToExcel
                className="btn btn-sm btn-danger "
                fileName="State master Records"
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
          // data={rowData.length >= 0 && rowData}
          data={testPlanIdData}
          defaultSortField="role_id"
          pagination
          paginationServer
          paginationTotalRows={rowData?.total?.total_count}
          paginationDefaultPage={rowData?.currentPage}
          onChangePage={(page) => setPaginationData({ currentPage: page })}
          onChangeRowsPerPage={(newPageSize) => {
            setPaginationData({ rowPerPage: newPageSize });
            setPaginationData({ currentPage: 1 });
          }}
          paginationRowsPerPageOptions={[10, 15, 20, 25, 30]}
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
          id={id}
        />
      )}
    </div>
  );
}

export default TestCaseReviewDetails;
