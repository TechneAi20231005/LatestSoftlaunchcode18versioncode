import React, { useEffect, useReducer, useState } from 'react';
import { Container, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { Astrick } from '../../../components/Utilities/Style';
import PageHeader from '../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportDataFile';
import { _base } from '../../../settings/constants';
import EditTestCaseModal from './EditTestCaseModal';
import DownloadFormatFileModal from './DownloadFormatFileModal';
import {
  getByTestPlanIDReviewedListThunk,
  getDraftTestCaseList,
  sendTestCaseReviewerThunk
} from '../../../redux/services/testCases/downloadFormatFile';
import { getEmployeeData } from '../../Dashboard/DashboardAction';
import { getReviewCommentMasterListThunk } from '../../../redux/services/testCases/reviewCommentMaster';
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

function ReviewedTestDraftComponent() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const {
    allReviewDraftTestListDataByID,
    allReviewDraftTestListData,
    filterReviewList
  } = useSelector((state) => state?.downloadFormat);

  const [paginationData, setPaginationData] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    { rowPerPage: 10, currentPage: 1, currentFilterData: {} }
  );

  const { getFilterReviewCommentMasterList } = useSelector(
    (state) => state?.reviewCommentMaster
  );
  const testerData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.getAllTesterDataList
  );
  const [downloadmodal, setDownloadModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });
  const [sendToReviewerModal, setSendToReviewerModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });

  const [addEditTestCasesModal, setAddEditTestCasesModal] = useState({
    type: '',
    data: '',
    open: false
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleDownloadModal = (data) => {
    setDownloadModal(data);
  };

  const handleSendToReviewerModal = (currentData) => {
    setSendToReviewerModal(currentData);
    dispatch(getEmployeeData());
  };

  const handleCheckboxChange = (row) => {
    localDispatch({
      type: 'SET_SELECTED_ROWS',
      payload: (prevSelectedRows) => {
        if (prevSelectedRows.includes(row.id)) {
          return prevSelectedRows.filter(
            (selectedRow) => selectedRow !== row.id
          );
        } else {
          return [...prevSelectedRows, row.id];
        }
      }
    });
  };

  const moduleMapping = {
    module_name: 'module_id',
    sub_module_name: 'submodule_id',
    function_name: 'function_id',
    field: 'field',
    platform: 'platform',
    type_name: 'type_id',
    id: 'id',
    severity: 'severity',
    group_name: 'group_id',
    steps: 'steps',
    expected_result: 'expected_result',
    status: 'status',
    project_name: 'project_id',
    test_description: 'test_description'
  };

  const generateOptions = (options) => {
    return [
      <option key="default" value="" disabled>
        Select Reviewer comment
      </option>,
      ...options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))
    ];
  };

  const handleFilterClick = (event, column, name, type, id) => {
    const filterKeyMap = {
      module_name: 'module_names',
      sub_module_name: 'sub_module_names',
      function_name: 'function_names',
      field: 'field_names',
      platform: 'platforms',
      type_name: 'type_names',
      id: 'ids',
      severity: 'severities',
      group_name: 'group_names',
      steps: 'steps',
      expected_result: 'expected_results',
      status: 'status',
      project_name: 'project_names'
    };
    const filteredData = filterReviewList[filterKeyMap[column]];
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

  const handleSelectAllNamesChange = () => {
    const newSelectAllNames = !selectAllNames;
    localDispatch({ type: 'SET_SELECT_ALL_NAMES', payload: newSelectAllNames });

    if (newSelectAllNames) {
      const draftRowIds = allReviewDraftTestListDataByID.map((row) => row.id);
      localDispatch({ type: 'SET_SELECTED_ROWS', payload: draftRowIds });
    } else {
      localDispatch({ type: 'SET_SELECTED_ROWS', payload: [] });
    }
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
        getByTestPlanIDReviewedListThunk({
          id: id,
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

  const handleSearchChange = (e) => {
    const term = e.target.value;
    localDispatch({
      type: 'SET_SEARCH_TERM',
      payload: term
    });
  };

  const handleClearAllFilter = async () => {
    const updatedFilters = filters?.filter(
      (filter) => filter.column !== filterColumnId
    );

    localDispatch({ type: 'SET_FILTERS', payload: updatedFilters });

    try {
      dispatch(
        getByTestPlanIDReviewedListThunk({
          id: id,
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

  const filteredResults = filterValues?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
        getByTestPlanIDReviewedListThunk({
          id: id,
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
      name: 'Action',
      selector: (row) => (
        <div className="d-flex align-items-center">
          <i
            className="icofont-edit text-primary btn btn-outline-secondary cp me-3"
            onClick={() =>
              setAddEditTestCasesModal({
                type: 'EDIT',
                data: row,
                open: true
              })
            }
          />

          <Link to={`/${_base + '/TestCaseHistoryComponent/' + row?.id}`}>
            <i class="icofont-history cp  btn btn-outline-secondary " />
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
      center: true,
      cell: (row) => (
        <div>
          <input
            type="checkbox"
            checked={selectedRows?.includes(row.id)}
            onChange={() => handleCheckboxChange(row)}
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
            className="icofont-filter ms-2"
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
                  {row.module_name && row.module_name.length < 20
                    ? row.module_name
                    : row.module_name.substring(0, 50) + '....'}
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
            className="icofont-filter ms-2"
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
          <span>Function</span>
          <i
            onClick={(e) =>
              handleFilterClick(e, 'function_name', 'Function', 'text')
            }
            className="icofont-filter ms-2"
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
      header: (column) => (
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
            className="icofont-filter ms-2"
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
            className="icofont-filter ms-2"
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
          {row.type_name && (
            <OverlayTrigger overlay={<Tooltip>{row.type_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.type_name && row.type_name.length < 20
                    ? row.type_name
                    : row.type_name.substring(0, 50) + '....'}
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
            className="icofont-filter ms-2"
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
          {row.group_name && (
            <OverlayTrigger overlay={<Tooltip>{row.group_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.group_name && row.group_name.length < 20
                    ? row.group_name
                    : row.group_name.substring(0, 50) + '....'}
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
          <span>Testing Id</span>
          <i
            onClick={(e) => handleFilterClick(e, 'id', 'Testing Id', 'number')}
            className="icofont-filter ms-2"
          />
        </div>
      ),
      selector: (row) => row.id,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.id && (
            <OverlayTrigger overlay={<Tooltip>{row.id} </Tooltip>}>
              <div>
                <span className="ms-1">{row.id}</span>
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
            onClick={(e) => handleFilterClick(e, 'id', 'Severity', 'text')}
            className="icofont-filter ms-2"
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
          <span>Test Description</span>
          <i
            onClick={(e) =>
              handleFilterClick(
                e,
                'test_description',
                'test_description',
                'text'
              )
            }
            className="icofont-filter ms-2"
          />
        </div>
      ),
      selector: (row) => row.test_description,
      width: '10rem',
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
                <span className="ms-1">{row.test_description}</span>
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
            className="icofont-filter ms-2"
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
          {row.expected_result && (
            <OverlayTrigger overlay={<Tooltip>{row.expected_result} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.expected_result && row.expected_result.length < 20
                    ? row.expected_result
                    : row.expected_result.substring(0, 50) + '....'}
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
          <span>Steps</span>
          <i
            onClick={(e) => handleFilterClick(e, 'steps', 'Steps', 'text')}
            className="icofont-filter ms-2"
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
          {row.steps && (
            <OverlayTrigger overlay={<Tooltip>{row.steps} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.steps && row.type_name.length < 20
                    ? row.steps
                    : row.steps.substring(0, 50) + '....'}
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
            className="icofont-filter ms-2"
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
          {row.status && (
            <OverlayTrigger overlay={<Tooltip>{row.status} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.status && row.status.length < 20
                    ? row.status
                    : row.status.substring(0, 50) + '....'}
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
          disabled
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
          defaultValue={row.other_remark}
          disabled
        />
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
            className="icofont-filter ms-2"
          />
        </div>
      ),
      selector: (row) => row.project_name,
      width: '10rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.project_name && (
            <OverlayTrigger overlay={<Tooltip>{row.project_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.project_name && row.project_name.length < 20
                    ? row.project_name
                    : row.project_name.substring(0, 50) + '....'}
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
            onClick={(e) =>
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
          {row.created_at && (
            <OverlayTrigger overlay={<Tooltip>{row.created_at} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.created_at && row.created_at.length < 20
                    ? row.created_at
                    : row.created_at.substring(0, 50) + '....'}
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
            onClick={(e) =>
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
          {row.created_by && (
            <OverlayTrigger overlay={<Tooltip>{row.created_by} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.created_by && row.created_by.length < 20
                    ? row.created_by
                    : row.created_by.substring(0, 50) + '....'}
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

  const exportColumns = [
    { title: 'Module', field: 'module_name' },
    { title: 'Submodule', field: 'sub_module_name' },
    { title: 'Function', field: 'function_name' },
    { title: 'Field', field: 'field' },
    { title: 'Testing Type', field: 'type_name' },
    { title: 'Testing Group', field: 'group_name' },
    { title: 'Steps', field: 'steps' },
    { title: 'Severity', field: 'severity' },
    { title: 'Expected Result', field: 'expected_result' },
    { title: 'Status', field: 'status' },
    { title: 'Project', field: 'project_name' },
    { title: 'Created At', field: 'created_at' },
    { title: 'Created By', field: 'created_by' },
    { title: 'Updated At', field: 'updated_at' },
    { title: 'Updated By', field: 'updated_by' }
  ];
  const handleSubmit = () => {
    const formData = {
      testcase_id: selectedRows,
      reviewer_id: reviewerId
    };

    dispatch(
      sendTestCaseReviewerThunk({
        formData,
        type: 'RESEND',
        id: id,
        onSuccessHandler: () => {
          setSendToReviewerModal({ showModal: false });
          localDispatch({
            type: 'SET_SELECTED_ROWS',
            payload: []
          });
          localDispatch({
            type: 'SET_SELECT_ALL_NAMES',
            payload: false
          });
          dispatch(
            getDraftTestCaseList({
              limit: paginationData.rowPerPage,
              page: paginationData.currentPage
            })
          );
          dispatch(
            getByTestPlanIDReviewedListThunk({
              id: id,
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
    dispatch(getReviewCommentMasterListThunk());
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
      getByTestPlanIDReviewedListThunk({
        id: id,
        limit: paginationData.rowPerPage,
        page: paginationData.currentPage,
        filter_testcase_data:
          updatedFilters?.length === 1 &&
          updatedFilters[0]?.column === filterColumnId
            ? []
            : updatedFilters
      })
    );
  }, [paginationData.rowPerPage, paginationData.currentPage]);

  const handleButtonClick = () => {
    dispatch(
      getByTestPlanIDReviewedListThunk({
        id: id,
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

  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Test Draft"
        renderRight={() => {
          return (
            <div className="col-md-6 d-flex justify-content-end">
              <button
                onClick={handleButtonClick}
                className="btn btn-primary text-white me-2"
                disabled={filterReviewList?.payload === 'null'}
              >
                Clear All Filter
              </button>
              <button
                className="btn btn btn-set-task w-sm-100 bg-success text-white"
                onClick={(e) => {
                  handleDownloadModal({
                    showModal: true,
                    modalData: '',
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
                apiData={allReviewDraftTestListDataByID}
                columns={exportColumns}
                fileName="Reviewed Test Draft List"
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
          data={allReviewDraftTestListDataByID}
          defaultSortField="role_id"
          pagination
          selectableRows={false}
          paginationServer
          paginationTotalRows={allReviewDraftTestListData?.total}
          paginationDefaultPage={paginationData?.currentPage}
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

      <div className="d-flex justify-content-end mt-3">
        <button
          onClick={() =>
            navigate(`/${_base}/TestDraft`, { state: 'review_test_draft' })
          }
          className="btn btn-primary text-white"
        >
          Back
        </button>

        <button
          onClick={() => {
            handleSendToReviewerModal({
              showModal: true,
              modalData: '',
              modalHeader: 'Send To Reviewer Modal'
            });
          }}
          disabled={allReviewDraftTestListDataByID?.length <= 0}
          type="submit"
          className="btn btn-sm btn bg-success text-white"
        >
          <i class="icofont-paper-plane"></i> {''}
          Send To Reviewer
        </button>
      </div>
      {downloadmodal.showModal === true && (
        <DownloadFormatFileModal
          show={downloadmodal}
          close={() => setDownloadModal(false)}
        />
      )}

      {addEditTestCasesModal.open === true && (
        <EditTestCaseModal
          show={addEditTestCasesModal?.open}
          type={addEditTestCasesModal?.type}
          currentTestCasesData={addEditTestCasesModal?.data}
          close={(prev) => setAddEditTestCasesModal({ ...prev, open: false })}
          paginationData={paginationData}
          id={id}
          payloadType={'ReviewTestDraft'}
        />
      )}

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
            id="reviewer_id"
            name="reviewer_id"
            options={testerData}
            required={true}
            onChange={(e) => {
              const selectedId = e?.value;
              localDispatch({ type: 'SET_REVIEWER_ID', payload: selectedId });
            }}
            placeholder="select..."
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            type="submit"
            className="btn btn-sm btn bg-success text-white"
            onClick={() => handleSubmit()}
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
    </div>
  );
}

export default ReviewedTestDraftComponent;
