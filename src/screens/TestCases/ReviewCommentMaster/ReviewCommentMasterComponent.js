import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import PageHeader from "../../../components/Common/PageHeader";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
import ReviewCommentMasterModal from "./Validation/ReviewCommentMasterModal";
import { useDispatch, useSelector } from "react-redux";
import { getReviewCommentMasterListThunk } from "../../../redux/services/testCases/reviewCommentMaster";
import { customSearchHandler } from "../../../utils/customFunction";
import TableLoadingSkelton from "../../../components/custom/loader/TableLoadingSkelton";
import { Col, Row } from "react-bootstrap";

function ReviewCommentMasterComponent() {
  const dispatch = useDispatch();

  // // redux state
  const { reviewCommentMasterList, isLoading } = useSelector(
    (state) => state?.reviewCommentMaster
  );

  const [searchValue, setSearchValue] = useState("");
  const [filteredReviewCommentMasterList, setFilteredReviewCommentMasterList] =
    useState([]);

  const [addEditReviewCommentModal, setAddEditReviewCommentModal] = useState({
    type: "",
    data: "",
    open: false,
  });

  // Function to handle search button click
  const handleSearch = () => {
    const filteredList = customSearchHandler(
      reviewCommentMasterList,
      searchValue
    );
    setFilteredReviewCommentMasterList(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchValue("");
    setFilteredReviewCommentMasterList(reviewCommentMasterList);
  };

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "70px",
    },
    {
      name: "Action",
      selector: (row) => (
        <i
          className="icofont-edit text-primary cp"
          onClick={() =>
            setAddEditReviewCommentModal({
              type: "EDIT",
              data: row,
              open: true,
            })
          }
        />
      ),
      sortable: false,
      width: "70px",
    },

    {
      name: "Status",
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_active == 1 && (
            <span className="badge bg-primary">Active</span>
          )}
          {row.is_active == 0 && (
            <span className="badge bg-danger">DeActive</span>
          )}
        </div>
      ),
      width: "100px",
    },
    {
      name: "Reviewer Comment Title",
      selector: (row) => row.reviewer_comment,
      sortable: false,
      width: "200px",
    },

    {
      name: "Created At",
      selector: (row) => row.created_at,
      sortable: false,
      width: "175px",
    },

    {
      name: "Created By",
      selector: (row) => row.created_by,
      sortable: false,
      width: "175px",
    },
    {
      name: "Updated At",
      selector: (row) => row.updated_at,
      sortable: false,
      width: "175px",
    },

    {
      name: "Updated By",
      selector: (row) => row.updated_by,
      sortable: false,
      width: "175px",
    },
  ];

  const transformDataForExport = (data) => {
    return data?.map((row, index) => ({
      "Sr No.": index + 1,
      "Reviewer Comment Title": row?.reviewer_comment || "--",
      "Created At": row?.created_at || "--",
      "Created By": row?.created_by || "--",
      "Updated At": row?.updated_at || "--",
      "Updated By": row?.updated_by || "--",
    }));
  };

  useEffect(() => {
    dispatch(getReviewCommentMasterListThunk());
  }, []);

  // Update the useEffect to update the filtered list when reviewCommentMasterList changes
  useEffect(() => {
    setFilteredReviewCommentMasterList(reviewCommentMasterList);
  }, [reviewCommentMasterList]);

  // Function to handle search onchange
  useEffect(() => {
    handleSearch();
  }, [searchValue]);
  return (
    <div className="container-xxl">
      <div className="d-flex justify-content-between">
        <PageHeader headerTitle="Review Comment Master" />
        <div style={{ marginTop: "-30px" }}>
          <button
            className="btn btn-primary text-white "
            onClick={() =>
              setAddEditReviewCommentModal({
                type: "ADD",
                data: "",
                open: true,
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
            placeholder="Enter review comment..."
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
            apiData={transformDataForExport(filteredReviewCommentMasterList)}
            fileName="Review Comment Records"
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
      <ReviewCommentMasterModal
        show={addEditReviewCommentModal?.open}
        type={addEditReviewCommentModal?.type}
        currentReviewCommentData={addEditReviewCommentModal?.data}
        close={(prev) => setAddEditReviewCommentModal({ ...prev, open: false })}
      />
    </div>
  );
}

export default ReviewCommentMasterComponent;
