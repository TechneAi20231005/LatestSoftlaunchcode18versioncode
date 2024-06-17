import React, { useEffect, useState, useReducer } from 'react';
import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import CustomFilterModal from '../Modal/CustomFilterModal';
import {
  getAllReviewTestDraftList,
  getDraftTestCaseList
} from '../../../redux/services/testCases/downloadFormatFile';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';

function ReviewedTestDraftDetails() {
  const dispatch = useDispatch();

  const { allReviewDraftTestListData, isLoading } = useSelector(
    (state) => state?.downloadFormat
  );

  const [paginationData, setPaginationData] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    { rowPerPage: 10, currentPage: 1, currentFilterData: {} }
  );

  const [filterColumn, setFilterColumn] = useState(null);
  const [filterColumnId, setFilterColumnId] = useState(null);

  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedFilters, setSelectedFilters] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filters, setFilters] = useState([]);
  const [columnName, setColumnName] = useState('');
  const [selectedFilterIds, setSelectedFilterIds] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [type, setType] = useState();

  const moduleMapping = {
    test_plan_id: 'test_plan_id',
    reviewer_name: 'reviewer_id',
    total_testcases: 'total_testcases',
    reviewed_testcases: 'reviewed_testcases',
    total_rejected: 'total_rejected',
    total_approved: 'total_approved'
  };

  const handleFilterClick = (event, column, name, type) => {
    setType(type);
    setColumnName(name);
    setFilterType('');
    setFilterText('');

    const rect = event.target.getBoundingClientRect();
    setModalPosition({ top: rect.bottom, left: rect.left });
    const columnId = moduleMapping[column];
    setFilterColumnId(columnId);
    setFilterColumn(column);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFilterColumn(null);
    setSearchTerm('');
    setSelectedFilters([]);
  };

  const handleAscendingClick = (order) => {
    setSortOrder(order);
  };

  const handleDescendingClick = (order) => {
    setSortOrder(order);
  };

  useEffect(() => {
    if (sortOrder && sortOrder != null) {
      handleApplyFilter(sortOrder);
    }
  }, [sortOrder]);

  const filteredUniqueValues =
    filterColumn &&
    allReviewDraftTestListData
      ?.map((row) => {
        return {
          value: row.id,
          label: row[filterColumn]
        };
      })
      ?.reduce((unique, item) => {
        return unique.some((e) => e.label === item.label)
          ? unique
          : [...unique, item];
      }, []);

  const handleFilterCheckboxChange = (event, label, value) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedFilters((prev) => [...prev, label]);
      setSelectedFilterIds((prev) => [...prev, value]);
    } else {
      setSelectedFilters((prev) => prev.filter((filter) => filter !== label));
      setSelectedFilterIds((prev) =>
        prev.filter((filterId) => filterId !== value)
      );
    }
  };

  // Function to handle select all checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedFilters(filteredUniqueValues.map((item) => item.label)); // Set selectedFilters with all labels
      setSelectedFilterIds(filteredUniqueValues.map((item) => item.value)); // Set selectedFilterIds with all values
    } else {
      setSelectedFilters([]); // Clear selectedFilters
      setSelectedFilterIds([]); // Clear selectedFilterIds
    }
  };

  const [betweenValues, setBetweenValues] = useState(['', '']);
  const handleBetweenValueChange = (index, value) => {
    if (filterType !== 'is not between' && filterType !== 'is between') {
      setBetweenValues(Number(value));
    } else {
      const newValues = [...betweenValues];
      newValues[index] = value;
      setBetweenValues(newValues);
    }
  };

  const getFilteredValues = () => {
    if (filterType === 'is not between' || filterType === 'is between') {
      return betweenValues.map((value) => Number(value));
    }
    // return filterText;

    return filterText;
  };

  const handleApplyFilter = async () => {
    const newFilter =
      filterType === 'is not between' || filterType === 'is between'
        ? {
            column: filterColumnId,
            column_name: filterColumn,
            filter: filterType,

            searchText: getFilteredValues(),
            //  getFilteredValues(),
            sort: sortOrder
          }
        : {
            column: filterColumnId,
            column_name: filterColumn,
            searchText: type === 'text' ? filterText : betweenValues,
            filter: filterType,
            sort: sortOrder
          };

    // // Update filters array with the new filter

    const updatedFilters = [...filters, newFilter];
    setFilters(updatedFilters);

    try {
      dispatch(
        getAllReviewTestDraftList({
          limit: paginationData.rowPerPage,
          page: paginationData.currentPage,
          filter_testcase_data: updatedFilters
        })
      );

      setModalIsOpen(false); // Close modal after applying filters

      setSearchTerm(''); // Reset search term if needed
      setSelectedFilters([]); // Reset selected filters if needed
    } catch (error) {}
  };

  const handleApplyButton = async () => {
    const newFilter = {
      column: filterColumnId,
      column_name: filterColumn,

      whereIn: selectedFilterIds,
      //  getFilteredValues(),
      sort: sortOrder
    };
    // filterType === 'is not between' || filterType === 'is between'
    //   ? {
    //       column: filterColumnId,
    //       column_name: filterColumn,
    //       filter: filterType,

    //       searchText: getFilteredValues(),
    //       //  getFilteredValues(),
    //       sort: sortOrder
    //     }
    //   : {
    //       column: filterColumnId,
    //       column_name: filterColumn,
    //       searchText: type === 'text' ? filterText : betweenValues,
    //       filter: filterType,
    //       sort: sortOrder
    //     };
    // // Update filters array with the new filter

    const updatedFilters = [...filters, newFilter];
    setFilters(updatedFilters);

    try {
      dispatch(
        getDraftTestCaseList({
          limit: paginationData.rowPerPage,
          page: paginationData.currentPage,
          filter_testcase_data: updatedFilters
        })
      );

      setModalIsOpen(false); // Close modal after applying filters

      setSearchTerm(''); // Reset search term if needed
      setSelectedFilters([]); // Reset selected filters if needed
    } catch (error) {
      // Handle error if needed
    }
  };

  const columns = [
    {
      name: 'Sr. No.',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '70px'
    },

    {
      name: (
        <div>
          <span>Test Plan Id</span>
          <i
            onClick={(e) =>
              handleFilterClick(e, 'test_plan_id', 'test_plan_id', 'text')
            }
            className="icofont-filter ms-2"
          />
        </div>
      ),

      selector: (row) => row.test_plan_id,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.test_plan_id && (
            <OverlayTrigger overlay={<Tooltip>{row.test_plan_id} </Tooltip>}>
              <div>
                <Link
                  to={`/${_base + '/ReviewedTestDraftComponent/' + row?.id}`}
                  className="link_underline_primary"
                >
                  {row.test_plan_id}
                </Link>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
      header: (column, sortDirection) => (
        <div className="d-flex align-items-center">
          <span>{column.name}</span>
          <i className="icofont-history cp bg-warning rounded-circle ms-2" />
        </div>
      )
    },

    {
      name: (
        <div>
          <span>Reviewer Name</span>
          <i
            onClick={(e) =>
              handleFilterClick(e, 'reviewer_name', 'Reviewer Name', 'text')
            }
            className="icofont-filter ms-2"
          />
        </div>
      ),

      selector: (row) => row.reviewer_name,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.reviewer_name && (
            <OverlayTrigger overlay={<Tooltip>{row.reviewer_name} </Tooltip>}>
              <div>{row.reviewer_name}</div>
            </OverlayTrigger>
          )}
        </div>
      ),
      header: (column, sortDirection) => (
        <div className="d-flex align-items-center">
          <span>{column.name}</span>
          <i className="icofont-history cp bg-warning rounded-circle ms-2" />
        </div>
      )
    },

    {
      name: (
        <div>
          <span>Total Testcase</span>
          <i
            onClick={(e) =>
              handleFilterClick(
                e,
                'total_testcases',
                'total_testcases',
                'number'
              )
            }
            className="icofont-filter ms-2"
          />
        </div>
      ),

      selector: (row) => row.total_testcases,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.total_testcases && (
            <OverlayTrigger overlay={<Tooltip>{row.total_testcases} </Tooltip>}>
              <div>{row.total_testcases}</div>
            </OverlayTrigger>
          )}
        </div>
      ),
      header: (column, sortDirection) => (
        <div className="d-flex align-items-center">
          <span>{column.name}</span>
          <i className="icofont-history cp bg-warning rounded-circle ms-2" />
        </div>
      )
    },

    {
      name: (
        <div>
          <span>Reviewed Testcase</span>
          <i
            onClick={(e) =>
              handleFilterClick(
                e,
                'reviewed_testcases',
                'reviewed_testcases',
                'number'
              )
            }
            className="icofont-filter ms-2"
          />
        </div>
      ),

      selector: (row) => row.reviewed_testcases,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.reviewed_testcases && (
            <OverlayTrigger
              overlay={<Tooltip>{row.reviewed_testcases} </Tooltip>}
            >
              <div>{row.reviewed_testcases}</div>
            </OverlayTrigger>
          )}
        </div>
      ),
      header: (column, sortDirection) => (
        <div className="d-flex align-items-center">
          <span>{column.name}</span>
          <i className="icofont-history cp bg-warning rounded-circle ms-2" />
        </div>
      )
    },

    {
      name: (
        <div>
          <span>Rejected Testcase</span>
          <i
            onClick={(e) =>
              handleFilterClick(e, 'total_rejected', 'total_rejected', 'number')
            }
            className="icofont-filter ms-2"
          />
        </div>
      ),

      selector: (row) => row.total_rejected,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.total_rejected && (
            <OverlayTrigger overlay={<Tooltip>{row.total_rejected} </Tooltip>}>
              <div>{row.total_rejected}</div>
            </OverlayTrigger>
          )}
        </div>
      ),
      header: (column, sortDirection) => (
        <div className="d-flex align-items-center">
          <span>{column.name}</span>
          <i className="icofont-history cp bg-warning rounded-circle ms-2" />
        </div>
      )
    },

    {
      name: (
        <div>
          <span>Approved Testcse</span>
          <i
            onClick={(e) =>
              handleFilterClick(e, 'total_approved', 'total_approved', 'number')
            }
            className="icofont-filter ms-2"
          />
        </div>
      ),

      selector: (row) => row.total_approved,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.total_approved && (
            <OverlayTrigger overlay={<Tooltip>{row.total_approved} </Tooltip>}>
              <div>{row.total_approved}</div>
            </OverlayTrigger>
          )}
        </div>
      ),
      header: (column, sortDirection) => (
        <div className="d-flex align-items-center">
          <span>{column.name}</span>
          <i className="icofont-history cp bg-warning rounded-circle ms-2" />
        </div>
      )
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

  useEffect(() => {
    dispatch(
      getAllReviewTestDraftList({
        limit: paginationData.rowPerPage,
        page: paginationData.currentPage
      })
    );
  }, [paginationData.rowPerPage, paginationData.currentPage]);
  return (
    <>
      <Container fluid className="employee_joining_details_container">
        <div>
          <DataTable
            columns={columns}
            data={allReviewDraftTestListData}
            defaultSortField="role_id"
            pagination
            paginationServer
            paginationTotalRows={allReviewDraftTestListData?.total}
            paginationDefaultPage={paginationData?.currentPage}
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
            progressPending={isLoading?.allReviewDraftTestListData}
            progressComponent={<TableLoadingSkelton />}
          />

          {modalIsOpen && (
            <CustomFilterModal
              show={modalIsOpen}
              handleClose={closeModal}
              handleApply={handleApplyFilter}
              position={modalPosition}
              filterColumn={filterColumn}
              filterColumnId={filterColumnId}
              handleCheckboxChange={handleFilterCheckboxChange}
              selectedFilters={selectedFilters}
              handleSelectAll={handleSelectAll}
              uniqueValues={filteredUniqueValues}
              searchTerm={searchTerm}
              filterType={filterType}
              setSearchTerm={setSearchTerm}
              paginationData={paginationData}
              setFilterType={setFilterType}
              setFilterText={setFilterText}
              handleAscendingClick={handleAscendingClick}
              handleDescendingClick={handleDescendingClick}
              handleBetweenValueChange={handleBetweenValueChange}
              columnName={columnName}
              type={type}
              handleApplyButton={handleApplyButton}
            />
          )}
        </div>
      </Container>
    </>
  );
}

export default ReviewedTestDraftDetails;
