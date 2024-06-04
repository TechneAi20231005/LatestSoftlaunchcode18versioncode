import React, { useEffect, useState, useRef } from 'react';
import { Container, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import CustomFilterModal from '../Modal/CustomFilterModal';
import { getAllReviewTestDraftList } from '../../../redux/services/testCases/downloadFormatFile';
import { useDispatch, useSelector } from 'react-redux';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';

function ReviewedTestDraftDetails() {
  const dispatch = useDispatch();

  const { allReviewDraftTestListData, isLoading } = useSelector(
    (state) => state?.downloadFormat
  );

  // const columns = (handleFilterClick) => [
  //   {
  //     name: <div className="d-flex">Sr. No.</div>,
  //     selector: (row, index) => index + 1,
  //     sortable: false,
  //     width: "80px",
  //     cell: (row) => <div className="d-flex">{row.id}</div>,
  //   },
  //   {
  //     name: (
  //       <div className="d-flex">
  //         <input type="checkbox" />
  //       </div>
  //     ),
  //     selector: "selectAll",
  //     width: "5rem",
  //     center: true,
  //     cell: (row) => (
  //       <div>
  //         <input type="checkbox" />
  //       </div>
  //     ),
  //   },
  //   {
  //     name: (
  //       <div className="d-flex">
  //         Module
  //         <i
  //           className="icofont-filter mx-5"
  //           onClick={(e) => handleFilterClick(e, "name")}
  //         ></i>
  //       </div>
  //     ),
  //     selector: (row) => row.name,
  //     sortable: false,
  //     width: "100px",
  //   },

  //   {
  //     name: (
  //       <div className="d-flex ">
  //         Submodule
  //         <i
  //           class="icofont-filter"
  //           onClick={(e) => handleFilterClick(e, "result")}
  //         ></i>
  //       </div>
  //     ),
  //     selector: (row) => row.result,
  //     sortable: false,
  //     width: "150px",
  //   },

  //   {
  //     name: <div className="d-flex">Test Plan Id</div>,
  //     selector: "selectAll",
  //     width: "10rem",
  //     center: true,
  //     cell: (row) => (
  //       <div>
  //         <Link
  //           className="link_underline_primary"
  //           to={`/${_base}/ReviewedTestDraftComponent`}
  //         >
  //           {row.name}
  //         </Link>
  //       </div>
  //     ),
  //   },
  // ];

  const columns = [
    {
      name: 'Sr. No.',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '70px'
    },
    {
      name: <div className="d-flex">Test Plan Id</div>,
      selector: 'Test Plan ID',
      width: '10rem',
      center: true,
      cell: (row) => (
        <div>
          <Link
            to={`/${_base + '/ReviewedTestDraftComponent/' + row.id}`}
            className="link_underline_primary"
          >
            {row.test_plan_id}
          </Link>
        </div>
      )
    },
    {
      name: 'Reviewer Name',
      selector: (row) => row.reviewer_name,
      sortable: false,
      width: '10rem'
    },

    {
      name: 'Total Testcase',
      selector: (row) => row.total_testcases,
      sortable: false,
      width: '7rem'
    },
    {
      name: 'Reviewed Testcase',
      selector: (row) => row.reviewed_testcases,
      sortable: false,
      width: '10rem'
    },
    {
      name: 'Rejected Testcase',
      selector: (row) => row.total_rejected,
      sortable: false,
      width: '10rem'
    },
    {
      name: 'Approved Testcse',
      selector: (row) => row.total_approved,
      sortable: false,
      width: '10rem'
    },
    {
      name: 'Created At',
      selector: (row) => row.created_at,
      sortable: false,
      width: '7rem'
    },

    {
      name: 'Updated At',
      selector: (row) => row.updated_at,
      sortable: false,
      width: '7rem'
    }
  ];

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filterColumn, setFilterColumn] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  // const [filteredData, setFilteredData] = useState(data);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef();
  // // const iconRef = useRef(null);

  const handleFilterClick = (event, column) => {
    const rect = event.target.getBoundingClientRect();
    setModalPosition({ top: rect.bottom, left: rect.left });
    setFilterColumn(column);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFilterColumn(null);
  };

  // const handleApplyFilter = () => {
  //   let newData = data;
  //   if (selectedFilters.length > 0 && filterColumn) {
  //     newData = data.filter((row) => selectedFilters.includes(row[filterColumn]));
  //   }
  //   setFilteredData(newData);
  //   closeModal();
  // };

  // const handleCheckboxChange = (event, value) => {
  //   if (event.target.checked) {
  //     setSelectedFilters((prev) => [...prev, value]);
  //   } else {
  //     setSelectedFilters((prev) => prev.filter((filter) => filter !== value));
  //   }
  // };

  // const handleSelectAll = (event, uniqueValues) => {
  //   if (event.target.checked) {
  //     setSelectedFilters(uniqueValues);
  //   } else {
  //     setSelectedFilters([]);
  //   }
  // };

  // // Function to filter rquestData based on search terms

  // const filteredUniqueValues = filterColumn
  //   ? Array.from(new Set(data.map((row) => row[filterColumn]))).filter((value) =>
  //       value.toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  //   : [];

  useEffect(() => {
    dispatch(getAllReviewTestDraftList());
  }, []);

  return (
    <>
      <Container fluid className="employee_joining_details_container">
        <div>
          <DataTable
            // columns={columns(handleFilterClick)}
            columns={columns}
            // data={filteredData ? filteredData : data}
            data={allReviewDraftTestListData}
            defaultSortField="role_id"
            pagination
            selectableRows={false}
            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
            highlightOnHover={true}
            progressPending={isLoading?.allReviewDraftTestListData}
            progressComponent={<TableLoadingSkelton />}
          />

          {/* {modalIsOpen && (
            <CustomFilterModal
              show={modalIsOpen}
              handleClose={closeModal}
              handleApply={handleApplyFilter}
              position={modalPosition}
              filterColumn={filterColumn}
              handleCheckboxChange={handleCheckboxChange}
              selectedFilters={selectedFilters}
              handleSelectAll={handleSelectAll}
              uniqueValues={filteredUniqueValues}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )} */}
        </div>
      </Container>
    </>
  );
}

export default ReviewedTestDraftDetails;
