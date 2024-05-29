import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import PageHeader from "../../../components/Common/PageHeader";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
import { useDispatch, useSelector } from "react-redux";
import { customSearchHandler } from "../../../utils/customFunction";
import TableLoadingSkelton from "../../../components/custom/loader/TableLoadingSkelton";
import AddTestingTypeModal from "./AddTestingTypeModal";
import { getTestingTypeMasterListThunk } from "../../../redux/services/testCases/testingTypeMaster";
import { Col, Row } from "react-bootstrap";

function TestingTypeMasterComponent() {
  const dispatch = useDispatch();

  // // redux state
  const { testingTypeMasterList, isLoading } = useSelector(
    (state) => state?.testingTypeMaster
  );
  const [searchValue, setSearchValue] = useState("");
  const [filteredTestingTypeMasterList, setFilterTestingTypeMasterList] =
    useState([]);

  const [addEditTestingTypeModal, setAddEditTestingTypeModal] = useState({
    type: "",
    data: "",
    open: false,
  });

  // Function to handle search button click
  const handleSearch = () => {
    const filteredList = customSearchHandler(
      testingTypeMasterList,
      searchValue
    );
    setFilterTestingTypeMasterList(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchValue("");
    setFilterTestingTypeMasterList(testingTypeMasterList);
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
            setAddEditTestingTypeModal({
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
            <span className="badge bg-primary" style={{ width: "4rem" }}>
              Active
            </span>
          )}
          {row.is_active == 0 && (
            <span className="badge bg-danger" style={{ width: "4rem" }}>
              DeActive
            </span>
          )}
        </div>
      ),
      width: "100px",
    },

    {
      name: "Testing Type Title",
      selector: (row) => row.type_name,
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
      "Testing Type Title": row?.type_name || "--",
      "Created At": row?.created_at || "--",
      "Created By": row?.created_by || "--",
      "Updated At": row?.updated_at || "--",
      "Updated By": row?.updated_by || "--",
    }));
  };

  useEffect(() => {
    dispatch(getTestingTypeMasterListThunk());
  }, []);

  // Update the useEffect to update the filtered list when testingTypeMasterList changes
  useEffect(() => {
    setFilterTestingTypeMasterList(testingTypeMasterList);
  }, [testingTypeMasterList]);

  // Function to handle search onchange
  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  return (
    <div className="container-xxl">
      <div className="d-flex justify-content-between">
        <PageHeader headerTitle="Testing Type Master" />
        <div style={{ marginTop: "-30px" }}>
          <button
            className="btn btn-primary text-white "
            onClick={() =>
              setAddEditTestingTypeModal({
                type: "ADD",
                data: "",
                open: true,
              })
            }
          >
            <i className="icofont-plus px-2"></i>
            Add Testing Type
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
            apiData={transformDataForExport(filteredTestingTypeMasterList)}
            fileName="Review Comment Records"
            disabled={!filteredTestingTypeMasterList?.length}
          />
        </Col>
      </Row>

      <DataTable
        columns={columns}
        data={filteredTestingTypeMasterList}
        defaultSortField="role_id"
        pagination
        selectableRows={false}
        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
        highlightOnHover={true}
        progressPending={isLoading?.getTestingTypeMasterList}
        progressComponent={<TableLoadingSkelton />}
      />
      <AddTestingTypeModal
        show={addEditTestingTypeModal?.open}
        type={addEditTestingTypeModal?.type}
        currentTestingTypeData={addEditTestingTypeModal?.data}
        close={(prev) => setAddEditTestingTypeModal({ ...prev, open: false })}
      />
    </div>
  );
}

export default TestingTypeMasterComponent;
