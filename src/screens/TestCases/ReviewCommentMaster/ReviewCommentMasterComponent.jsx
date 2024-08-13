import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportDataFile';
import { getReviewCommentMasterListThunk } from '../../../redux/services/testCases/reviewCommentMaster';
import { customSearchHandler } from '../../../utils/customFunction';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import AddEditReviewCommentMaster from './Validation/AddEditReviewCommentMaster';
function ReviewCommentMasterComponent() {
  const dispatch = useDispatch();

  // // redux state
  const { reviewCommentMasterList, isLoading } = useSelector(
    (state) => state?.reviewCommentMaster
  );

  const [searchValue, setSearchValue] = useState('');
  const [filteredReviewCommentMasterList, setFilteredReviewCommentMasterList] =
    useState([]);

  const [addEditReviewCommentModal, setAddEditReviewCommentModal] = useState({
    type: '',
    data: '',
    open: false
  });

  const handleSearch = () => {
    const filteredList = customSearchHandler(
      reviewCommentMasterList,
      searchValue
    );
    setFilteredReviewCommentMasterList(filteredList);
  };

  const handleReset = () => {
    setSearchValue('');
    setFilteredReviewCommentMasterList(reviewCommentMasterList);
  };

  const columns = [
    {
      name: 'Sr. No.',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '70px'
    },
    {
      name: 'Action',
      selector: (row) => (
        <i
          className="icofont-edit text-primary cp"
          onClick={() =>
            setAddEditReviewCommentModal({
              type: 'EDIT',
              data: row,
              open: true
            })
          }
        />
      ),
      sortable: false,
      width: '70px'
    },

    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_active == 1 && (
            <span className="badge bg-primary">Active</span>
          )}
          {row.is_active == 0 && (
            <span className="badge bg-danger">Deactive</span>
          )}
        </div>
      ),
      width: '100px'
    },
    {
      name: 'Reviewer Comment Title',
      selector: (row) => row.reviewer_comment,
      sortable: false,
      width: '200px'
    },

    {
      name: 'Created At',
      selector: (row) => row.created_at,
      sortable: false,
      width: '175px'
    },

    {
      name: 'Created By',
      selector: (row) => row.created_by,
      sortable: false,
      width: '175px'
    },
    {
      name: 'Updated At',
      selector: (row) => row.updated_at,
      sortable: false,
      width: '175px'
    },

    {
      name: 'Updated By',
      selector: (row) => row.updated_by,
      sortable: false,
      width: '175px'
    }
  ];

  const transformDataForExport = (data) => {
    return data.map((row) => ({
      ...row,
      status: row.is_active == 1 ? 'Active' : 'Deactive'
    }));
  };

  const transformedData = transformDataForExport(
    filteredReviewCommentMasterList
  );

  const exportColumns = [
    { title: 'Reviewer Comment Title', field: 'reviewer_comment' },
    { title: 'Status', field: 'status' },

    { title: 'Created At', field: 'created_at' },
    { title: 'Created By', field: 'created_by' },
    { title: 'Updated At', field: 'updated_at' },
    { title: 'Updated By', field: 'updated_by' }
  ];

  useEffect(() => {
    dispatch(getReviewCommentMasterListThunk());
  }, []);

  useEffect(() => {
    setFilteredReviewCommentMasterList(reviewCommentMasterList);
  }, [reviewCommentMasterList]);

  useEffect(() => {
    handleSearch();
  }, [searchValue]);
  return (
    <div className="container-xxl">
      <div className="d-flex justify-content-between">
        <PageHeader headerTitle="Review Comment Master" />
        <div style={{ marginTop: '-30px' }}>
          <button
            className="btn btn-primary text-white "
            onClick={() =>
              setAddEditReviewCommentModal({
                type: 'ADD',
                data: '',
                open: true
              })
            }
          >
            <i className="icofont-plus px-2"></i>
            Add Reviewer Comment
          </button>
        </div>
      </div>

      <Row className="row_gap_3">
        <Col xs={12} md={7} xxl={8}>
          <input
            type="search"
            name="interview_search"
            value={searchValue}
            onChange={(e) => setSearchValue(e?.target?.value)}
            placeholder="Enter reviewer comment..."
            className="form-control"
          />
        </Col>
        <Col
          xs={12}
          md={5}
          xxl={4}
          className="d-flex justify-content-sm-end btn_container"
        >
          <button
            className="btn btn-warning text-white"
            type="button"
            onClick={handleSearch}
          >
            <i className="icofont-search-1 " /> Search
          </button>
          <button
            className="btn btn-info text-white"
            type="button"
            onClick={handleReset}
          >
            <i className="icofont-refresh text-white" /> Reset
          </button>
          <ExportToExcel
            className="btn btn-danger"
            apiData={transformedData}
            columns={exportColumns}
            fileName="Review Comment Master Records"
            disabled={!filteredReviewCommentMasterList?.length}
          />
        </Col>
      </Row>
      <DataTable
        columns={columns}
        data={filteredReviewCommentMasterList}
        defaultSortField="role_id"
        pagination
        selectableRows={false}
        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
        highlightOnHover={true}
        progressPending={isLoading?.getReviewCommentMasterList}
        progressComponent={<TableLoadingSkelton />}
      />
      <AddEditReviewCommentMaster
        show={addEditReviewCommentModal?.open}
        type={addEditReviewCommentModal?.type}
        currentReviewCommentData={addEditReviewCommentModal?.data}
        close={(prev) => setAddEditReviewCommentModal({ ...prev, open: false })}
      />
    </div>
  );
}

export default ReviewCommentMasterComponent;
