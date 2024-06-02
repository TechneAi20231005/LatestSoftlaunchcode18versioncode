import React, { useEffect, useReducer, useState } from 'react';
import { Container } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { Astrick } from '../../../components/Utilities/Style';
import PageHeader from '../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import EditTestCaseModal from './EditTestCaseModal';
import DownloadFormatFileModal from './DownloadFormatFileModal';
import { getByTestPlanIDReviewedListThunk } from '../../../redux/services/testCases/downloadFormatFile';
import { useDispatch, useSelector } from 'react-redux';

function ReviewedTestDraftComponent() {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { allReviewDraftTestListDataByID } = useSelector((state) => state?.downloadFormat);

  const [rowData, setRowData] = useState(allReviewDraftTestListDataByID);

  const [paginationData, setPaginationData] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    { rowPerPage: 10, currentPage: 1, currentFilterData: {} }
  );

  const [modal, setModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });

  const handleModal = (data) => {
    setModal(data);
  };

  const [downloadmodal, setDownloadModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });

  const handleDownloadModal = (data) => {
    setDownloadModal(data);
  };

  const data = [
    {
      id: 1,
      name: 'John Doe',
      age: 30,
      email: 'john@example.com'
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 25,
      email: 'jane@example.com'
    }
    // Add more objects as needed
  ];

  const columns = [
    {
      name: 'Action',
      selector: (row) => (
        <>
          <i
            className="icofont-edit text-primary cp"
            onClick={(e) => {
              handleModal({
                showModal: true,
                modalData: '', // You can add relevant data here
                modalHeader: 'Edit Test Case'
              });
            }}
          />
          <Link to={`/${_base}/TestCaseHistoryComponent`}>
            <i className="icofont-history text-dark w-10  cp bg-warning rounded-circle  ml-2 icon-large mx-2 " />
          </Link>
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
      selector: (row) => row.name,
      sortable: false,
      width: '100px'
    },
    {
      name: 'Reviewr coment',
      selector: (row) => row?.name,
      sortable: true,
      width: '250px',
      cell: (row) => (
        <select class="form-select" aria-label="Default select example">
          <option selected className>
            Open this select menu
          </option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      )
    },
    {
      name: 'Remark',
      selector: (row) => row?.name,
      sortable: true,
      width: '400px',
      cell: (row) => (
        <input
          class="form-control"
          type="text"
          placeholder="Default input"
          aria-label="default input example"
        ></input>
      )
    }
  ];

  useEffect(() => {
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
                //   apiData={ExportData}

                fileName="State master Records"
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
          data={rowData}
          defaultSortField="role_id"
          pagination
          selectableRows={false}
          paginationServer
          paginationTotalRows={rowData?.total?.total_count}
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

      <div className="row mt-4">
        <div className="col-md-3">
          <label className="form-label font-weight-bold">
            Content Type :<Astrick color="red" size="13px" />{' '}
          </label>

          <select class="form-select" aria-label="Default select example">
            <option selected className>
              Open this select menu
            </option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label font-weight-bold">Remark :</label>
          <input className="form-control"></input>
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <Link
          to={{
            pathname: `/${_base}/TestDraft`,
            state: 'review_test_draft' // Pass currentTab as state
          }}
          className="btn btn-primary text-white"
        >
          Back
        </Link>

        <button type="submit" className="btn btn-sm btn bg-success text-white">
          <i class="icofont-paper-plane"></i> {''}
          Send To Reviewer
        </button>
      </div>
      {modal.showModal === true && <EditTestCaseModal show={modal} close={() => setModal(false)} />}
      {downloadmodal.showModal === true && (
        <DownloadFormatFileModal show={downloadmodal} close={() => setDownloadModal(false)} />
      )}
    </div>
  );
}

export default ReviewedTestDraftComponent;
