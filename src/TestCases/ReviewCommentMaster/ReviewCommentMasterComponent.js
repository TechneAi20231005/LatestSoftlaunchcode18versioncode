import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import PageHeader from "../../components/Common/PageHeader";
import { ExportToExcel } from "../../components/Utilities/Table/ExportToExcel";
import ReviewCommentMasterModal from "./Validation/ReviewCommentMasterModal";
import { useDispatch, useSelector } from "react-redux";
import { getReviewCommentMasterListThunk } from "../../redux/services/testCases/reviewCommentMaster";
import { customSearchHandler } from "../../utils/customFunction";
import TableLoadingSkelton from "../../components/custom/loader/TableLoadingSkelton";

function ReviewCommentMasterComponent() {
  const dispatch = useDispatch();

  // // redux state
  const { reviewCommentMasetrList, isLoading } = useSelector(
    (state) => state?.reviewCommentMaster
  );

  const [searchValue, setSearchValue] = useState("");
  const [filteredRevieCommentMasterList, setFilteredReviewCommentkMasterList] =
    useState([]);

  const [addEditReviewCommentModal, setAddEditReviewCommentModal] = useState({
    type: "",
    data: "",
    open: false,
  });

  // Function to handle search button click
  const handleSearch = () => {
    const filteredList = customSearchHandler(
      reviewCommentMasetrList,
      searchValue
    );
    setFilteredReviewCommentkMasterList(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchValue("");
    setFilteredReviewCommentkMasterList(reviewCommentMasetrList);
  };

  // Update the useEffect to update the filtered list when reviewCommentMasetrList changes
  useEffect(() => {
    setFilteredReviewCommentkMasterList(reviewCommentMasetrList);
  }, [reviewCommentMasetrList]);

  // Function to handle search onchange
  useEffect(() => {
    handleSearch();
  }, [searchValue]);

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
      selector: (row) => (row.is_active === 1 ? "Active" : "Deactive"),
      sortable: false,
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

  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Review Comment Master"
        renderRight={() => {
          return (
            <div className="col-md-6 d-flex justify-content-end">
              <div className="justify-content-between">
                <button
                  className="btn btn-primary text-white"
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontFamily: "Open Sans",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() =>
                    setAddEditReviewCommentModal({
                      type: "ADD",
                      data: "",
                      open: true,
                    })
                  }
                >
                  <i
                    className="icofont-plus"
                    style={{ marginRight: "8px" }}
                  ></i>
                  Add Reviewer Comment
                </button>
              </div>
            </div>
          );
        }}
      />
      <div className="col-md-12 d-flex justify-content-start">
        <div className="col">
          <input
            className="form-control form-control-md"
            value={searchValue}
            onChange={(e) => setSearchValue(e?.target?.value)}
          ></input>
        </div>
        <button
          className="btn btn-warning text-white"
          style={{
            color: "white",
            fontWeight: "600",
            fontFamily: "Open Sans",
          }}
          onClick={handleSearch}
        >
          <i style={{ marginRight: "8px" }} class="icofont-search"></i>
          Search
        </button>

        <ExportToExcel
          className="btn btn-sm btn-danger"
          apiData={transformDataForExport(filteredRevieCommentMasterList)}
          style={{
            color: "white",
            fontWeight: "600",
            fontFamily: "Open Sans",
          }}
          fileName="Review Comment Records"
        />

        <button
          className="btn btn-info btn-set-task w-md-100"
          style={{
            color: "white",
            fontWeight: "600",
            fontFamily: "Open Sans",
          }}
          onClick={handleReset}
        >
          <i style={{ marginRight: "8px" }} class="icofont-refresh"></i>
          Reset
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filteredRevieCommentMasterList}
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
