import React, { useEffect, useReducer, useState } from 'react';
import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import PageHeader from '../../../components/Common/PageHeader';
import { getTestCaseReviewListThunk } from '../../../redux/services/testCases/testCaseReview';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import CustomFilterModal from '../Modal/CustomFilterModal';

const initialState = {
  filterType: '',
  columnName: '',
  type: '',
  filterText: '',
  filterValues: [],
  modalPosition: { top: 0, left: 0 },
  filterColumnId: null,
  filterColumn: null,
  modalIsOpen: false,
  searchTerm: '',
  selectedFilterIds: '',
  selectedFilters: [],
  filters: [],
  sortOrder: null,
  reviewerId: null,
  selectAllNames: false,
  selectedRows: [],
  betweenValues: ['', '']
};

function localReducer(state, action) {
  switch (action.type) {
    case 'SET_FILTER_TYPE':
      return { ...state, filterType: action.payload };
    case 'SET_COLUMN_NAME':
      return { ...state, columnName: action.payload };
    case 'SET_TYPE':
      return { ...state, type: action.payload };
    case 'SET_FILTER_TEXT':
      return { ...state, filterText: action.payload };
    case 'SET_FILTER_VALUES':
      return { ...state, filterValues: action.payload };
    case 'SET_MODAL_POSITION':
      return { ...state, modalPosition: action.payload };
    case 'SET_FILTER_COLUMN_ID':
      return { ...state, filterColumnId: action.payload };
    case 'SET_FILTER_COLUMN':
      return { ...state, filterColumn: action.payload };
    case 'SET_MODAL_IS_OPEN':
      return { ...state, modalIsOpen: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_SELECTED_FILTER_IDS':
      return { ...state, selectedFilterIds: action.payload };
    case 'SET_SELECTED_FILTER':
      return { ...state, selectedFilters: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_SORT_ORDER':
      return { ...state, sortOrder: action.payload };
    case 'SET_REVIEWER_ID':
      return { ...state, reviewerId: action.payload };
    case 'SET_SELECT_ALL_NAMES':
      return { ...state, selectAllNames: action.payload };
    case 'SET_SELECTED_ROWS':
      return {
        ...state,
        selectedRows:
          typeof action?.payload === 'function'
            ? action?.payload(state.selectedRows)
            : action?.payload
      };
    case 'SET_BETWEEN_VALUES':
      return { ...state, betweenValues: action.payload };
    default:
      return state;
  }
}

function TestCaseReviewComponent() {
  const dispatch = useDispatch();
  const [paginationData, setPaginationData] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    { rowPerPage: 10, currentPage: 1, currentFilterData: {} }
  );
  const { testCaseReviewList, isLoading, filterTestCaseReviewList } =
    useSelector((state) => state?.testCaseReview);

  const [state, localDispatch] = useReducer(localReducer, initialState);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    filterType,
    columnName,
    type,
    filterText,
    filterValues,
    modalPosition,
    filterColumnId,
    filterColumn,
    modalIsOpen,
    searchTerm,
    selectedFilterIds,
    selectedFilters,
    filters,
    sortOrder,
    reviewerId,
    selectAllNames,
    selectedRows,
    betweenValues
  } = state;

  const moduleMapping = {
    test_plan_id: 'test_plan_id',
    reviewer_name: 'reviewer_name',
    total_testcases: 'total_testcases',
    total_reviewed_testcases: 'total_reviewed_testcases',
    total_rejected_testcases: 'total_rejected_testcases',
    total_approved_testcases: 'total_approved_testcases',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  const handleFilterClick = (event, column, name, type, id) => {
    const filterKeyMap = {
      test_plan_id: 'test_plan_ids',
      reviewer_name: 'reviewer_names',
      total_testcases: 'total_testcases',
      total_reviewed_testcases: 'total_reviewed_testcases',
      total_rejected_testcases: 'total_rejected_testcases',
      total_approved_testcases: 'total_approved_testcases',
      created_at: 'created_at',
      updated_at: 'updated_at'
    };
    const filteredData = filterTestCaseReviewList[filterKeyMap[column]];
    const columnId = moduleMapping[column];
    localDispatch({ type: 'SET_FILTER_TYPE', payload: '' });
    localDispatch({ type: 'SET_COLUMN_NAME', payload: name });
    localDispatch({ type: 'SET_TYPE', payload: type });
    localDispatch({ type: 'SET_FILTER_TEXT', payload: '' });
    localDispatch({ type: 'SET_SELECTED_FILTER_IDS', payload: '' });
    localDispatch({ type: 'SET_FILTER_VALUES', payload: filteredData });
    localDispatch({ type: 'SET_FILTER_COLUMN', payload: column });
    localDispatch({ type: 'SET_FILTER_COLUMN_ID', payload: columnId });
    localDispatch({ type: 'SET_MODAL_IS_OPEN', payload: true });
    const rect = event.target.getBoundingClientRect();
    localDispatch({
      type: 'SET_MODAL_POSITION',
      payload: { top: rect.bottom, left: rect.left }
    });
  };

  const closeModal = () => {
    localDispatch({ type: 'SET_MODAL_IS_OPEN', payload: false });
    localDispatch({ type: 'SET_FILTER_COLUMN', payload: '' });
    localDispatch({ type: 'SET_SEARCH_TERM', payload: '' });
    localDispatch({ type: 'SET_SELECTED_FILTER', payload: '' });
  };

  const handleAscendingClick = (order) => {
    localDispatch({
      type: 'SET_SORT_ORDER',
      payload: order
    });
  };

  const handleDescendingClick = (order) => {
    localDispatch({
      type: 'SET_SORT_ORDER',
      payload: order
    });
  };

  const handleFilterCheckboxChange = (event, label, value) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      localDispatch({
        type: 'SET_SELECTED_FILTER',
        payload: [...state.selectedFilters, label]
      });

      localDispatch({
        type: 'SET_SELECTED_FILTER_IDS',
        payload: [...state.selectedFilterIds, value]
      });
    } else {
      localDispatch({
        type: 'SET_SELECTED_FILTER',
        payload: [...state.selectedFilters.filter((filter) => filter !== label)]
      });

      localDispatch({
        type: 'SET_SELECTED_FILTER_IDS',
        payload: state.selectedFilterIds.filter(
          (filterId) => filterId !== value
        )
      });
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    localDispatch({
      type: 'SET_SEARCH_TERM',
      payload: term
    });
  };

  const filteredResults = filterValues?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      localDispatch({
        type: 'SET_SELECTED_FILTER',
        payload: filterValues?.map((item) => item.name)
      });

      localDispatch({
        type: 'SET_SELECTED_FILTER_IDS',
        payload: filterValues?.map((item) => item.id)
      });
    } else {
      localDispatch({ type: 'SET_SELECTED_FILTER', payload: [] });

      localDispatch({ type: 'SET_SELECTED_FILTER_IDS', payload: [] });
    }
  };

  const handleBetweenValueChange = (index, value) => {
    if (filterType !== 'is not between' && filterType !== 'is between') {
      localDispatch({ type: 'SET_BETWEEN_VALUES', payload: Number(value) });
    } else {
      const newValues = [...betweenValues];
      newValues[index] = value;
      if (
        newValues[0] !== undefined &&
        newValues[1] !== undefined &&
        newValues[0] !== '' &&
        newValues[1] !== ''
      ) {
        if (newValues[0] !== undefined && newValues[1] !== undefined) {
          if (newValues[0] > newValues[1]) {
            setErrorMessage(
              'The first value should not be greater than the second value.'
            );
          } else {
            setErrorMessage('');
          }
        }
      }
      localDispatch({ type: 'SET_BETWEEN_VALUES', payload: newValues });
    }
  };
  const getFilteredValues = () => {
    if (filterType === 'is not between' || filterType === 'is between') {
      return betweenValues.map((value) => Number(value));
    }

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
            sort: sortOrder
          }
        : {
            column: filterColumnId,
            column_name: filterColumn,
            searchText: type === 'text' ? filterText : betweenValues,
            filter: filterType,
            sort: sortOrder
          };

    const updatedFilters = [...filters, newFilter];
    localDispatch({ type: 'SET_FILTERS', payload: updatedFilters });

    try {
      dispatch(
        getTestCaseReviewListThunk({
          limit: paginationData.rowPerPage,
          page: paginationData.currentPage,
          filter_testcase_data: updatedFilters
        })
      );
      localDispatch({ type: 'SET_MODAL_IS_OPEN', payload: false });
      localDispatch({ type: 'SET_SEARCH_TERM', payload: '' });
      localDispatch({ type: 'SET_SELECTED_FILTER', payload: [] });
    } catch (error) {}
  };

  const handleClearAllFilter = async () => {
    const updatedFilters = filters?.filter(
      (filter) => filter.column !== filterColumnId
    );

    localDispatch({ type: 'SET_FILTERS', payload: updatedFilters });

    try {
      dispatch(
        getTestCaseReviewListThunk({
          limit: paginationData.rowPerPage,
          page: paginationData.currentPage,
          filter_testcase_data: updatedFilters
        })
      );
      localDispatch({ type: 'SET_MODAL_IS_OPEN', payload: false });
      localDispatch({ type: 'SET_SEARCH_TERM', payload: '' });
      localDispatch({ type: 'SET_SELECTED_FILTER', payload: [] });
    } catch (error) {}
  };

  const handleApplyButton = async () => {
    const newFilter = {
      column: filterColumnId,
      column_name: filterColumn,

      whereIn: selectedFilterIds,
      sort: sortOrder
    };

    const updatedFilters = [...filters, newFilter];
    localDispatch({ type: 'SET_FILTERS', payload: updatedFilters });

    try {
      dispatch(
        getTestCaseReviewListThunk({
          limit: paginationData.rowPerPage,
          page: paginationData.currentPage,
          filter_testcase_data: updatedFilters
        })
      );
      localDispatch({ type: 'SET_MODAL_IS_OPEN', payload: false });
      localDispatch({ type: 'SET_SEARCH_TERM', payload: '' });
      localDispatch({ type: 'SET_SELECTED_FILTER', payload: [] });
    } catch (error) {}
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
                  to={`/${_base + '/TestCaseReviewDetails/' + row?.id}`}
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
                'total_reviewed_testcases',
                'total_reviewed_testcases',
                'number'
              )
            }
            className="icofont-filter ms-2"
          />
        </div>
      ),

      selector: (row) => row.total_reviewed_testcases,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.total_reviewed_testcases && (
            <OverlayTrigger
              overlay={<Tooltip>{row.total_reviewed_testcases} </Tooltip>}
            >
              <div>{row.total_reviewed_testcases}</div>
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
              handleFilterClick(
                e,
                'total_rejected_testcases',
                'total_rejected_testcases',
                'number'
              )
            }
            className="icofont-filter ms-2"
          />
        </div>
      ),

      selector: (row) => row.total_rejected_testcases,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.total_rejected_testcases && (
            <OverlayTrigger
              overlay={<Tooltip>{row.total_rejected_testcases} </Tooltip>}
            >
              <div>{row.total_rejected_testcases}</div>
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
              handleFilterClick(
                e,
                'total_approved_testcases',
                'total_approved_testcases',
                'number'
              )
            }
            className="icofont-filter ms-2"
          />
        </div>
      ),

      selector: (row) => row.total_approved_testcases,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.total_approved_testcases && (
            <OverlayTrigger
              overlay={<Tooltip>{row.total_approved_testcases} </Tooltip>}
            >
              <div>{row.total_approved_testcases}</div>
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
          <span>Created At</span>
          <i
            onClick={(e, row) =>
              handleFilterClick(e, 'created_at', 'created_at', 'text')
            }
            className="icofont-filter ms-2"
          />
        </div>
      ),
      selector: (row) => row.created_at,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row?.created_at && (
            <OverlayTrigger overlay={<Tooltip>{row.created_at} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row?.created_at && row?.created_at?.length < 20
                    ? row?.created_at
                    : row?.created_at?.substring(0, 50) + '....'}
                </span>
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
          <span>Updated At</span>
          <i
            onClick={(e, row) =>
              handleFilterClick(e, 'updated_at', 'updated_at', 'text')
            }
            className="icofont-filter ms-2"
          />
        </div>
      ),
      selector: (row) => row.updated_at,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row?.updated_at && (
            <OverlayTrigger overlay={<Tooltip>{row.updated_at} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row?.updated_at && row?.updated_at?.length < 20
                    ? row?.updated_at
                    : row?.updated_at?.substring(0, 50) + '....'}
                </span>
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
          <span>Created By</span>
          <i
            onClick={(e, row) =>
              handleFilterClick(e, 'created_by', 'created_by', 'text')
            }
            className="icofont-filter ms-2"
          />
        </div>
      ),
      selector: (row) => row.created_by,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row?.created_by && (
            <OverlayTrigger overlay={<Tooltip>{row.created_by} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row?.created_by && row?.created_by?.length < 20
                    ? row?.created_by
                    : row?.created_by?.substring(0, 50) + '....'}
                </span>
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
          <span>Updated By</span>
          <i
            onClick={(e, row) =>
              handleFilterClick(e, 'updated_by', 'updated_by', 'text')
            }
            className="icofont-filter ms-2"
          />
        </div>
      ),
      selector: (row) => row.updated_by,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row?.updated_by && (
            <OverlayTrigger overlay={<Tooltip>{row.updated_by} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row?.updated_by && row?.updated_by?.length < 20
                    ? row?.updated_by
                    : row?.updated_by?.substring(0, 50) + '....'}
                </span>
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
    }
  ];

  const handleButtonClick = () => {
    dispatch(
      getTestCaseReviewListThunk({
        limit: paginationData.rowPerPage,
        page: paginationData.currentPage
      })
    );
  };

  useEffect(() => {
    if (sortOrder && sortOrder != null) {
      handleApplyFilter(sortOrder);
    }
  }, [sortOrder]);

  useEffect(() => {
    const newFilter =
      filterType === 'is not between' || filterType === 'is between'
        ? {
            column: filterColumnId,
            column_name: filterColumn,
            filter: filterType,
            searchText: getFilteredValues(),
            sort: sortOrder
          }
        : {
            column: filterColumnId,
            column_name: filterColumn,
            searchText: type === 'text' ? filterText : betweenValues,
            filter: filterType,
            sort: sortOrder
          };

    const updatedFilters = [...filters, newFilter];
    dispatch(
      getTestCaseReviewListThunk({
        limit: paginationData.rowPerPage,
        page: paginationData.currentPage,
        filter_testcase_data:
          updatedFilters?.length === 1 &&
          updatedFilters[0]?.column === filterColumnId
            ? []
            : updatedFilters
      })
    );
  }, []);
  return (
    <>
      <PageHeader
        headerTitle="Test Case Review"
        renderRight={() => {
          return (
            <div className="col-md-6 d-flex justify-content-end">
              <button
                onClick={handleButtonClick}
                className="btn btn-primary text-white me-2"
                disabled={filterTestCaseReviewList?.payload === 'null'}
              >
                Clear All Filter
              </button>
            </div>
          );
        }}
      />

      <Container fluid className="employee_joining_details_container">
        <DataTable
          columns={columns}
          data={testCaseReviewList}
          defaultSortField="role_id"
          pagination
          paginationServer
          paginationTotalRows={testCaseReviewList?.data?.total}
          paginationDefaultPage={testCaseReviewList?.currentPage}
          onChangePage={(page) => setPaginationData({ currentPage: page })}
          onChangeRowsPerPage={(newPageSize) => {
            setPaginationData({ rowPerPage: newPageSize });
            setPaginationData({ currentPage: 1 });
          }}
          paginationRowsPerPageOptions={[10, 15, 20, 25, 30]}
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
          progressComponent={<TableLoadingSkelton />}
        />
      </Container>

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
          filterData={filteredResults}
          searchTerm={searchTerm}
          filterType={filterType}
          paginationData={paginationData}
          handleAscendingClick={handleAscendingClick}
          handleDescendingClick={handleDescendingClick}
          handleBetweenValueChange={handleBetweenValueChange}
          columnName={columnName}
          type={type}
          handleApplyButton={handleApplyButton}
          localDispatch={localDispatch}
          handleSearchChange={handleSearchChange}
          handleClearAllFilter={handleClearAllFilter}
          errorMessage={errorMessage}
        />
      )}
    </>
  );
}

export default TestCaseReviewComponent;
