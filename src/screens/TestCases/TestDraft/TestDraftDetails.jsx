import React, { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { getEmployeeData } from '../../Dashboard/DashboardAction';
import {
  getDraftTestCaseList,
  sendTestCaseReviewerThunk
} from '../../../redux/services/testCases/downloadFormatFile';
import { Astrick } from '../../../components/Utilities/Style';
import EditTestCaseModal from './EditTestCaseModal';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import CustomFilterModal from '../Modal/CustomFilterModal';
import { _base } from '../../../settings/constants';

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
        // selectedRows: action.payload
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

function TestDraftDetails(props) {
  const clearAllFilter = props.clearData;

  const dispatch = useDispatch();

  const {
    getDraftTestListData,
    allDraftListData,
    allDraftTestListData,
    isLoading,
    filterData
  } = useSelector((state) => state?.downloadFormat);

  const testerData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.getAllTesterDataList
  );

  const [state, localDispatch] = useReducer(localReducer, initialState);

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

  const [addEditTestCasesModal, setAddEditTestCasesModal] = useState({
    type: '',
    data: '',
    open: false,
    id: null
  });
  const [sendToReviewerModal, setSendToReviewerModal] = useState({
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
  const [disable, setDisable] = useState(false);
  const [reviewerError, setReviewerError] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const moduleMapping = {
    module_name: 'module_id',
    sub_module_name: 'submodule_id',
    function_name: 'function_id',
    field: 'field',
    platform: 'platform',
    type_name: 'type_id',
    tc_id: 'tc_id',
    test_description: 'test_description',
    severity: 'severity',
    group_name: 'group_id',
    steps: 'steps',
    expected_result: 'expected_result',
    status: 'status',
    project_name: 'project_id',
    created_at: 'created_at',
    created_by: 'created_by',
    updated_at: 'updated_at',
    updated_by: 'updated_by'
  };

  const handleSelectAllNamesChange = () => {
    const newSelectAllNames = !selectAllNames;
    localDispatch({ type: 'SET_SELECT_ALL_NAMES', payload: newSelectAllNames });

    if (newSelectAllNames) {
      const draftRowIds = allDraftTestListData
        .filter((row) => row.status === 'DRAFT')
        .map((row) => row.tc_id);
      localDispatch({ type: 'SET_SELECTED_ROWS', payload: draftRowIds });
    } else {
      localDispatch({ type: 'SET_SELECTED_ROWS', payload: [] });
    }
  };

  const handleCheckboxChange = (row) => {
    localDispatch({
      type: 'SET_SELECTED_ROWS',
      payload: (prevSelectedRows) => {
        if (prevSelectedRows.includes(row.tc_id)) {
          return prevSelectedRows.filter(
            (selectedRow) => selectedRow !== row.tc_id
          );
        } else {
          return [...prevSelectedRows, row.tc_id];
        }
      }
    });
  };

  const handleFilterClick = (event, column, name, type, id) => {
    if (clearAllFilter === true) {
      localDispatch({ type: 'SET_FILTERS', payload: [] });
    }
    const filterKeyMap = {
      module_name: 'module_names',
      sub_module_name: 'sub_module_names',
      function_name: 'function_names',
      field: 'field_names',
      platform: 'platforms',
      type_name: 'type_names',
      tc_id: 'ids',
      test_description: 'test_descriptions',

      severity: 'severities',
      group_name: 'group_names',
      steps: 'steps',
      expected_result: 'expected_results',
      status: 'status',
      project_name: 'project_names',
      created_at: 'created_at',
      created_by: 'created_by',
      updated_at: 'updated_at',
      updated_by: 'updated_by'
    };
    const filteredData = filterData[filterKeyMap[column]];

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

  const handleSearchChange = (e) => {
    const term = e.target.value;
    localDispatch({
      type: 'SET_SEARCH_TERM',
      payload: term
    });
  };

  const filteredResults = filterValues?.filter((item) =>
    item?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );
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
  {
  }
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
        const value1 = parseFloat(newValues[0]);
        const value2 = parseFloat(newValues[1]);

        if (!isNaN(value1) && !isNaN(value2)) {
          if (value1 > value2) {
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
      return betweenValues?.map((value) => Number(value));
    }

    return filterText;
  };

  const handleClearAllButton = () => {
    localDispatch({ type: 'SET_SELECTED_FILTER', payload: [] });
    // localDispatch({
    //   type: 'SET_SORT_ORDER',
    //   payload: null
    // });
  };
  const [selectedValue, setSelectedValue] = useState('');

  const handleApplyFilter = async () => {
    props?.setClearData(false);
    const newFilter =
      filterType === 'is not between' || filterType === 'is between'
        ? {
            column: filterColumnId,
            column_name: filterColumn,
            filter: filterType ? filterType : selectedValue,
            searchText: getFilteredValues(),
            sort: sortOrder
          }
        : {
            column: filterColumnId,
            column_name: filterColumn,
            searchText: type === 'text' ? filterText : betweenValues,
            filter: filterType ? filterType : selectedValue,
            sort: sortOrder
          };
    const updatedFilters = [...filters, newFilter];
    localDispatch({ type: 'SET_FILTERS', payload: updatedFilters });
    props.setIsFilterApplied((prev) => ({
      ...prev,
      [filterColumnId]: true
    }));
    try {
      dispatch(
        getDraftTestCaseList({
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
    props?.setClearData(false);
    const newFilter = {
      column: filterColumnId,
      column_name: filterColumn,

      whereIn: selectedFilterIds,
      sort: sortOrder
    };

    const updatedFilters = [...filters, newFilter];
    localDispatch({ type: 'SET_FILTERS', payload: updatedFilters });

    props.setIsFilterApplied((prev) => ({
      ...prev,
      [filterColumn]: true
    }));
    try {
      dispatch(
        getDraftTestCaseList({
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
    props.setIsFilterApplied((prev) => ({
      ...prev,
      [filterColumn]: false
    }));

    const updatedFilters = filters?.filter(
      (filter) => filter.column !== filterColumnId
    );

    localDispatch({ type: 'SET_FILTERS', payload: updatedFilters });

    try {
      dispatch(
        getDraftTestCaseList({
          limit: paginationData?.rowPerPage,
          page: paginationData?.currentPage,
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
      name: 'Action',
      selector: (row) => (
        <div className="d-flex align-items-center">
          <i
            disabled={row.status !== 'DRAFT'}
            className={`icofont-edit text-primary btn btn-outline-secondary cp  ${
              row.status !== 'DRAFT' ? 'disabled-icon' : ''
            }`}
            onClick={() =>
              setAddEditTestCasesModal({
                type: 'EDIT',
                data: row,
                open: true,
                id: row.tc_id
              })
            }
          />
          <Link to={`/${_base + '/TestCaseHistoryComponent/' + row?.tc_id}`}>
            <i class="icofont-history cp btn btn-outline-secondary fw-bold  " />
          </Link>
        </div>
      ),
      sortable: false,
      width: '150px'
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
      width: '5rem',
      center: true,
      cell: (row) => (
        <div>
          <input
            type="checkbox"
            checked={selectedRows.includes(row.tc_id)}
            onChange={() => handleCheckboxChange(row)}
            disabled={row.status !== 'DRAFT'}
          />
        </div>
      )
    },

    {
      name: (
        <div>
          <span>Module</span>
          <i
            onClick={(e, row) =>
              handleFilterClick(e, 'module_name', 'Module', 'text')
            }
            className={`icofont-filter ms-2 ${
              props?.isFilterApplied['module_name']
                ? 'text-success'
                : 'text-dark'
            }`}
          />
        </div>
      ),

      selector: (row) => row.module_name,
      width: '10rem',
      sortable: false,
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
                  {row?.module_name && row?.module_name?.length < 20
                    ? row?.module_name
                    : row?.module_name?.substring(0, 50) + '....'}
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
          <span>Submodule Name</span>
          <i
            onClick={(e, row) =>
              handleFilterClick(e, 'sub_module_name', 'Submodule Name', 'text')
            }
            className={`icofont-filter ms-2 ${
              props?.isFilterApplied['sub_module_name']
                ? 'text-success'
                : 'text-dark'
            }`}
          />
        </div>
      ),
      selector: (row) => row.sub_module_name,
      width: '10rem',
      sortable: false,
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
          <span>Platform</span>
          <i
            onClick={(e) =>
              handleFilterClick(e, 'platform', 'Platform', 'text')
            }
            className={`icofont-filter ms-2 ${
              props?.isFilterApplied['platform'] ? 'text-success' : 'text-dark'
            }`}
          />
        </div>
      ),
      selector: (row) => row.platform,
      width: '7rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.platform && (
            <OverlayTrigger overlay={<Tooltip>{row.platform} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.platform && row.platform.length < 20
                    ? row.platform
                    : row.platform.substring(0, 50) + '....'}
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
          <span>Function</span>
          <i
            onClick={(e) =>
              handleFilterClick(e, 'function_name', 'Function', 'text')
            }
            className={`icofont-filter ms-2 ${
              props?.isFilterApplied['function_name']
                ? 'text-success'
                : 'text-dark'
            }`}
          />
        </div>
      ),
      selector: (row) => row.function_name,
      width: '7rem',
      sortable: false,
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
          <span>Field</span>
          <i
            onClick={(e) => handleFilterClick(e, 'field', 'Field', 'text')}
            className={`icofont-filter ms-2 ${
              props?.isFilterApplied['field'] ? 'text-success' : 'text-dark'
            }`}
          />
        </div>
      ),
      selector: (row) => row.field,
      width: '7rem',
      sortable: false,
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
          <span>Testing Type</span>
          <i
            onClick={(e) =>
              handleFilterClick(e, 'type_name', 'Testing Type', 'text')
            }
            className={`icofont-filter ms-2 ${
              props?.isFilterApplied['type_name'] ? 'text-success' : 'text-dark'
            }`}
          />
        </div>
      ),
      selector: (row) => row.type_name,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row?.type_name && (
            <OverlayTrigger overlay={<Tooltip>{row.type_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row?.type_name && row?.type_name?.length < 20
                    ? row?.type_name
                    : row?.type_name?.substring(0, 50) + '....'}
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
          <span>Testing Group</span>
          <i
            onClick={(e) =>
              handleFilterClick(e, 'group_name', 'Testing Group', 'text')
            }
            className={`icofont-filter ms-2 ${
              props?.isFilterApplied['group_name']
                ? 'text-success'
                : 'text-dark'
            }`}
          />
        </div>
      ),
      selector: (row) => row.group_name,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row?.group_name && (
            <OverlayTrigger overlay={<Tooltip>{row.group_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row?.group_name && row?.group_name?.length < 20
                    ? row?.group_name
                    : row?.group_name?.substring(0, 50) + '....'}
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
          <span>Test Id</span>
          <i
            onClick={(e) => handleFilterClick(e, 'tc_id', 'Test Id', 'number')}
            className={`icofont-filter ms-2 ${
              props?.isFilterApplied['tc_id'] ? 'text-success' : 'text-dark'
            }`}
          />
        </div>
      ),
      selector: (row) => row.tc_id,
      width: '7rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.tc_id && (
            <OverlayTrigger overlay={<Tooltip>{row.tc_id} </Tooltip>}>
              <div>
                <span className="ms-1">{row.tc_id}</span>
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
          <span>Test Description</span>
          <i
            onClick={(e) =>
              handleFilterClick(
                e,
                'test_description',
                'Test Description',
                'text'
              )
            }
            className={`icofont-filter ms-2 ${
              props?.isFilterApplied['test_description']
                ? 'text-success'
                : 'text-dark'
            }`}
          />
        </div>
      ),
      selector: (row) => row.test_description,
      width: '12rem',
      sortable: false,
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
                <span>
                  {row.test_description && row.test_description.length < 80
                    ? row.test_description
                    : row.test_description.substring(0, 80) + '....'}
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
          <span>Severity</span>
          <i
            onClick={(e) =>
              handleFilterClick(e, 'severity', 'Severity', 'text')
            }
            className={`icofont-filter ms-2 ${
              props?.isFilterApplied['severity'] ? 'text-success' : 'text-dark'
            }`}
          />
        </div>
      ),
      selector: (row) => row.severity,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.severity && (
            <OverlayTrigger overlay={<Tooltip>{row.severity} </Tooltip>}>
              <div>
                <span className="ms-1">{row.severity}</span>
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
          <span>Steps</span>
          <i
            onClick={(e) => handleFilterClick(e, 'steps', 'Steps', 'text')}
            className={`icofont-filter ms-2 ${
              props?.isFilterApplied['steps'] ? 'text-success' : 'text-dark'
            }`}
          />
        </div>
      ),
      selector: (row) => row.steps,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row?.steps && (
            <OverlayTrigger overlay={<Tooltip>{row.steps} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row?.steps && row.type_name?.length < 20
                    ? row?.steps
                    : row?.steps?.substring(0, 50) + '....'}
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
          <span>Expected Result</span>
          <i
            onClick={(e) =>
              handleFilterClick(e, 'expected_result', 'Expected Result', 'text')
            }
            className={`icofont-filter ms-2 ${
              props?.isFilterApplied['expected_result']
                ? 'text-success'
                : 'text-dark'
            }`}
          />
        </div>
      ),
      selector: (row) => row.expected_result,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row?.expected_result && (
            <OverlayTrigger overlay={<Tooltip>{row.expected_result} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row?.expected_result && row?.expected_result?.length < 20
                    ? row?.expected_result
                    : row?.expected_result?.substring(0, 50) + '....'}
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
          <span>Status</span>
          <i
            onClick={(e) => handleFilterClick(e, 'status', 'Status', 'text')}
            className={`icofont-filter ms-2 ${
              props?.isFilterApplied['status'] ? 'text-success' : 'text-dark'
            }`}
          />
        </div>
      ),
      selector: (row) => row.status,
      width: '7rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row?.status && (
            <OverlayTrigger overlay={<Tooltip>{row.status} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row?.status && row?.status?.length < 20
                    ? row?.status
                    : row?.status?.substring(0, 50) + '....'}
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
          <span>Project</span>
          <i
            onClick={(e) =>
              handleFilterClick(e, 'project_name', 'Project', 'text')
            }
            className={`icofont-filter ms-2 ${
              props?.isFilterApplied['project_name']
                ? 'text-success'
                : 'text-dark'
            }`}
          />
        </div>
      ),
      selector: (row) => row.project_name,
      width: '7rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row?.project_name && (
            <OverlayTrigger overlay={<Tooltip>{row.project_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row?.project_name && row?.project_name?.length < 20
                    ? row?.project_name
                    : row?.project_name?.substring(0, 50) + '....'}
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
          <span>Created At</span>
          <i
            onClick={(e, row) =>
              handleFilterClick(e, 'created_at', 'created_at', 'text')
            }
            className={`icofont-filter ms-2 ${
              props?.isFilterApplied['created_at']
                ? 'text-success'
                : 'text-dark'
            }`}
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
            <OverlayTrigger overlay={<Tooltip>{row?.created_at} </Tooltip>}>
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
          <span>Created By</span>
          <i
            onClick={(e, row) =>
              handleFilterClick(e, 'created_by', 'created_by', 'text')
            }
            className={`icofont-filter ms-2 ${
              props?.isFilterApplied['created_by']
                ? 'text-success'
                : 'text-dark'
            }`}
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
          <span>Updated At</span>
          <i
            onClick={(e, row) =>
              handleFilterClick(e, 'updated_at', 'updated_at', 'text')
            }
            className={`icofont-filter ms-2 ${
              props?.isFilterApplied['updated_at']
                ? 'text-success'
                : 'text-dark'
            }`}
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
          <span>Updated By</span>
          <i
            onClick={(e, row) =>
              handleFilterClick(e, 'updated_by', 'updated_by', 'text')
            }
            className={`icofont-filter ms-2 ${
              props?.isFilterApplied['updated_by']
                ? 'text-success'
                : 'text-dark'
            }`}
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

  const handleSendToReviewerModal = (currentData) => {
    setSendToReviewerModal(currentData);
    dispatch(getEmployeeData());
  };

  const handleSubmit = () => {
    if (!reviewerId) {
      setReviewerError('Reviewer Id is Required');
    } else {
      setReviewerError('');
    }
    const testCasesData =
      selectedRows?.length > 0
        ? selectedRows?.map((id) => id)
        : getDraftTestListData
            ?.filter((row) => row.status === 'DRAFT')
            ?.map((row) => row.id);

    let formData;

    if (selectedRows?.length <= 0) {
      formData = {
        reviewer_id: reviewerId
      };
    } else {
      formData = {
        testcase_id: testCasesData,
        reviewer_id: reviewerId
      };
    }
    setDisable(true);
    dispatch(
      sendTestCaseReviewerThunk({
        formData,
        type: 'DRAFT',
        id: null,

        onSuccessHandler: () => {
          setSendToReviewerModal({ showModal: false });
          setDisable(false);
          localDispatch({ type: 'SET_REVIEWER_ID', payload: null });
          localDispatch({ type: 'SET_SELECTED_ROWS', payload: [] });

          localDispatch({ type: 'SET_SELECT_ALL_NAMES', payload: false });

          dispatch(
            getDraftTestCaseList({
              limit: paginationData.rowPerPage,
              page: paginationData.currentPage
            })
          );
        },
        onErrorHandler: () => {}
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
            filter: filterType ? filterType : selectedValue,
            searchText: getFilteredValues(),
            sort: sortOrder
          }
        : {
            column: filterColumnId,
            column_name: filterColumn,
            searchText: type === 'text' ? filterText : betweenValues,
            filter: filterType ? filterType : selectedValue,
            sort: sortOrder
          };

    const updatedFilters = [...filters, newFilter];
    dispatch(
      getDraftTestCaseList({
        limit: paginationData?.rowPerPage,
        page: paginationData?.currentPage,
        filter_testcase_data:
          updatedFilters?.length === 1 &&
          updatedFilters[0]?.column === filterColumnId
            ? []
            : updatedFilters
      })
    );
  }, [paginationData.rowPerPage, paginationData.currentPage]);

  return (
    <>
      <Container fluid className="employee_joining_details_container">
        <h5 className="mb-0 text-primary">Test Cases</h5>
        <hr className="primary_divider mt-1" />
        <DataTable
          columns={columns}
          data={getDraftTestListData}
          defaultSortField="role_id"
          pagination
          paginationServer
          paginationTotalRows={allDraftListData?.data?.total}
          paginationDefaultPage={paginationData?.currentPage}
          onChangePage={(page) => setPaginationData({ currentPage: page })}
          onChangeRowsPerPage={(newPageSize) => {
            setPaginationData({ rowPerPage: newPageSize });
            setPaginationData({ currentPage: 1 });
          }}
          paginationRowsPerPageOptions={[10, 15, 20, 25, 30]}
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
          progressPending={isLoading?.getDraftTestListData}
          progressComponent={<TableLoadingSkelton />}
        />
      </Container>
      <div className="d-flex justify-content-end mt-3">
        <button
          type="submit"
          className="btn btn-sm bg-success text-white"
          onClick={() => {
            handleSendToReviewerModal({
              showModal: true,
              modalData: '',
              modalHeader: 'Send To Reviewer Modal'
            });
          }}
          disabled={
            !getDraftTestListData ||
            getDraftTestListData?.filter((item) => item.status === 'DRAFT')
              .length === 0
          }
        >
          <i class="icofont-paper-plane fs-0.8"></i> {''}
          Send To Reviewer
        </button>
      </div>

      <Modal
        centered
        show={sendToReviewerModal.showModal}
        size="sm"
        onHide={(e) => {
          handleSendToReviewerModal({
            showModal: true,
            modalData: '',
            modalHeader: 'Send To Reviewer Modal'
          });
        }}
      >
        {' '}
        <Modal.Body>
          <label>
            <b>
              Reviewer : <Astrick color="red" size="13px" />
            </b>
          </label>
          <Select
            type="text"
            className="form-control form-control-sm"
            id="reviewer_id"
            name="reviewer_id"
            options={testerData}
            required
            onChange={(e) => {
              const selectedId = e?.value;
              localDispatch({ type: 'SET_REVIEWER_ID', payload: selectedId });
              setReviewerError('');
            }}
            placeholder="select..."
          />
          {reviewerError && (
            <p
              style={{
                color: 'red'
              }}
            >
              {reviewerError}
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            type="submit"
            className="btn btn-sm btn bg-success text-white"
            onClick={() => handleSubmit()}
            disabled={disable}
          >
            <i class="icofont-paper-plane "></i> {''}
            Send To Reviewer
          </button>

          <button
            type="button"
            className="btn btn bg-white shadow p-2 text-black"
            onClick={() => {
              handleSendToReviewerModal({
                showModal: false,
                modalData: '',
                modalHeader: 'Send To Reviewer Modal'
              });
            }}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>

      {addEditTestCasesModal.open === true && (
        <EditTestCaseModal
          show={addEditTestCasesModal?.open}
          type={addEditTestCasesModal?.type}
          currentTestCasesData={addEditTestCasesModal?.data}
          close={(prev) => setAddEditTestCasesModal({ ...prev, open: false })}
          paginationData={paginationData}
          id={addEditTestCasesModal?.id}
          payloadType={'DRAFT'}
        />
      )}

      {modalIsOpen && (
        <CustomFilterModal
          show={modalIsOpen}
          handleClose={closeModal}
          handleApply={handleApplyFilter}
          handleClearAllButton={handleClearAllButton}
          position={modalPosition}
          filterColumn={filterColumn}
          filterColumnId={filterColumnId}
          handleCheckboxChange={handleFilterCheckboxChange}
          selectedFilters={selectedFilters}
          handleSelectAll={handleSelectAll}
          filterData={filteredResults}
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          filterType={filterType}
          paginationData={paginationData}
          handleAscendingClick={handleAscendingClick}
          handleDescendingClick={handleDescendingClick}
          handleBetweenValueChange={handleBetweenValueChange}
          columnName={columnName}
          type={type}
          handleApplyButton={handleApplyButton}
          localDispatch={localDispatch}
          handleClearAllFilter={handleClearAllFilter}
          errorMessage={errorMessage}
          setSelectedValue={setSelectedValue}
          selectedValue={selectedValue}
        />
      )}
    </>
  );
}

export default TestDraftDetails;
