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
  getExportAllReviewTestDraftList,
  getTestCaseStatusDataList,
  sendTestCaseReviewerThunk
} from '../../../redux/services/testCases/downloadFormatFile';
import { getEmployeeData } from '../../Dashboard/DashboardAction';
import { getReviewCommentMasterListThunk } from '../../../redux/services/testCases/reviewCommentMaster';
import CustomFilterModal from '../Modal/CustomFilterModal';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';

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
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

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
    allReviewDraftTestListDataTotal,
    filterReviewList,
    exportAllReviewDraftTestListData
  } = useSelector((state) => state?.downloadFormat);

  // const [paginationData, setPaginationData] = useReducer(
  //   (prevState, nextState) => {
  //     return { ...prevState, ...nextState };
  //   },
  //   { rowPerPage: 10, currentPage: 1, currentFilterData: {} }
  // );

  const [paginationData, setPaginationData] = useState({
    pageIndex: 0,
    pageSize: 100
  });

  const { testCasesStatusDataList } = useSelector(
    (state) => state?.downloadFormat
  );

  const { getFilterReviewCommentMasterList } = useSelector(
    (state) => state?.reviewCommentMaster
  );
  const testerData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.getAllTesterDataList
  );

  const filterTestData = testerData?.filter(
    (d) => d?.value != localStorage?.getItem('id')
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

  // const handleCheckboxChange = (row) => {
  //   localDispatch({
  //     type: 'SET_SELECTED_ROWS',
  //     payload: (prevSelectedRows) => {
  //       if (prevSelectedRows.includes(row.id)) {
  //         return prevSelectedRows.filter(
  //           (selectedRow) => selectedRow !== row.id
  //         );
  //       } else {
  //         return [...prevSelectedRows, row.id];
  //       }
  //     }
  //   });
  // };
  const totalRows = exportAllReviewDraftTestListData?.length;

  const handleCheckboxChange = (row) => {
    localDispatch({
      type: 'SET_SELECTED_ROWS',
      payload: (prevSelectedRows) => {
        let updatedSelectedRows;

        if (prevSelectedRows.includes(row.id)) {
          updatedSelectedRows = prevSelectedRows?.filter(
            (selectedRow) => selectedRow !== row?.id
          );
        } else {
          updatedSelectedRows = [...prevSelectedRows, row.id];
        }

        // Check if all rows are selected
        if (updatedSelectedRows?.length === totalRows) {
          localDispatch({ type: 'SET_SELECT_ALL_NAMES', payload: true });
        } else {
          localDispatch({ type: 'SET_SELECT_ALL_NAMES', payload: false });
        }

        return updatedSelectedRows;
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
    tc_id: 'tc_id',
    severity: 'severity',
    group_name: 'group_id',
    steps: 'steps',
    expected_result: 'expected_result',
    status: 'status',
    project_name: 'project_id',
    test_description: 'test_description',
    created_at: 'created_at',
    created_by: 'created_by'
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
    if (clearData === true) {
      localDispatch({ type: 'SET_FILTERS', payload: [] });
    }
    const filterKeyMap = {
      module_name: 'module',
      sub_module_name: 'submodule',
      function_name: 'function',
      field: 'field',
      platform: 'platform',
      type_name: 'type_names',
      tc_id: 'ids',
      severity: 'severity',
      group_name: 'group_names',
      steps: 'steps',
      expected_result: 'expected_results',
      status: 'status',
      project_name: 'project_names',
      test_description: 'test_descriptions',
      created_at: 'created_at',
      created_by: 'created_by'
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
      const draftRowIds = exportAllReviewDraftTestListData.map((row) => row.id);
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
    if (
      filterType !== 'is not between' &&
      filterType !== 'is between' &&
      selectedValue !== 'is between' &&
      selectedValue !== 'is not between'
    ) {
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
    if (
      filterType === 'is not between' ||
      filterType === 'is between' ||
      selectedValue === 'is between' ||
      selectedValue === 'is not between'
    ) {
      return betweenValues.map((value) => Number(value));
    }

    return filterText;
  };

  const handleApplyFilter = async () => {
    setClearData(false);
    const newFilter =
      filterType === 'is not between' ||
      filterType === 'is between' ||
      selectedValue === 'is between' ||
      selectedValue === 'is not between'
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

    // const updatedFilters = [...filters, newFilter];
    const getLatestConditions = (data) => {
      const latestConditions = {};

      // Traverse the list to keep the most recent condition for each column
      data.forEach((condition) => {
        const column = condition.column;
        latestConditions[column] = condition;
      });

      // Convert the dictionary back to a list
      const latestConditionsList = Object.values(latestConditions);

      return latestConditionsList;
    };
    const updatedFiltersData = [...filters, newFilter];

    const updatedFilters = getLatestConditions(updatedFiltersData);
    localDispatch({ type: 'SET_FILTERS', payload: updatedFilters });
    setIsFilterApplied((prev) => ({
      ...prev,
      [filterColumnId]: true
    }));
    try {
      dispatch(
        getByTestPlanIDReviewedListThunk({
          id: id,
          limit: paginationData.pageSize,
          page: paginationData.pageIndex + 1,
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
    setIsFilterApplied((prev) => ({
      ...prev,
      [filterColumn]: false
    }));
    const updatedFilters = filters?.filter(
      (filter) => filter.column !== filterColumnId
    );

    localDispatch({ type: 'SET_FILTERS', payload: updatedFilters });

    try {
      dispatch(
        getByTestPlanIDReviewedListThunk({
          id: id,
          limit: paginationData.pageSize,
          page: paginationData.pageIndex + 1,
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
    setClearData(false);

    const newFilter = {
      column: filterColumnId,
      column_name: filterColumn,

      whereIn: selectedFilterIds,
      sort: sortOrder
    };

    const updatedFilters = [...filters, newFilter];
    localDispatch({ type: 'SET_FILTERS', payload: updatedFilters });
    setIsFilterApplied((prev) => ({
      ...prev,
      [filterColumn]: true
    }));

    try {
      dispatch(
        getByTestPlanIDReviewedListThunk({
          id: id,
          limit: paginationData.pageSize,
          page: paginationData.pageIndex + 1,
          filter_testcase_data: updatedFilters
        })
      );
      localDispatch({ type: 'SET_MODAL_IS_OPEN', payload: false });
      localDispatch({ type: 'SET_SEARCH_TERM', payload: '' });
      localDispatch({ type: 'SET_SELECTED_FILTER', payload: [] });
    } catch (error) {}
  };

  // const columns = [
  //   {
  //     name: 'Action',
  //     selector: (row) => (
  //       <div className="d-flex align-items-center">
  //         <i
  //           className="icofont-edit text-primary btn btn-outline-secondary cp me-3"
  //           onClick={() =>
  //             setAddEditTestCasesModal({
  //               type: 'EDIT',
  //               data: row,
  //               open: true
  //             })
  //           }
  //         />

  //         <Link to={`/${_base + '/TestCaseHistoryComponent/' + row?.id}`}>
  //           <i class="icofont-history cp  btn btn-outline-secondary " />
  //         </Link>
  //       </div>
  //     ),
  //     sortable: false,
  //     width: '150px'
  //   },

  //   {
  //     name: (
  //       <div onClick={handleSelectAllNamesChange}>
  //         <input
  //           type="checkbox"
  //           checked={selectAllNames}
  //           onChange={handleSelectAllNamesChange}
  //         />
  //       </div>
  //     ),
  //     selector: 'selectAll',
  //     center: true,
  //     cell: (row) => (
  //       <div>
  //         <input
  //           type="checkbox"
  //           checked={selectedRows?.includes(row.id)}
  //           onChange={() => handleCheckboxChange(row)}
  //         />
  //       </div>
  //     )
  //   },

  //   {
  //     name: (
  //       <div>
  //         <span>Module</span>
  //         <i
  //           onClick={(e, row) =>
  //             handleFilterClick(e, 'module_name', 'Module', 'text')
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['module_name'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),

  //     selector: (row) => row?.module?.module_name,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row?.module?.module_name && (
  //           <OverlayTrigger
  //             overlay={<Tooltip>{row?.module?.module_name} </Tooltip>}
  //           >
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {row?.module?.module_name &&
  //                 row?.module?.module_name?.length < 20
  //                   ? row?.module?.module_name
  //                   : row?.module?.module_name.substring(0, 50) + '....'}
  //               </span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     header: (column, sortDirection) => (
  //       <div className="d-flex align-items-center">
  //         <span>{column.name}</span>
  //         <i className="icofont-history cp bg-warning rounded-circle ms-2" />
  //       </div>
  //     )
  //   },

  //   {
  //     name: (
  //       <div>
  //         <span>Submodule Name</span>
  //         <i
  //           onClick={(e, row) =>
  //             handleFilterClick(e, 'sub_module_name', 'Submodule Name', 'text')
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['sub_module_name'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),
  //     selector: (row) => row?.sub_module?.module_name,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.sub_module_name && (
  //           <OverlayTrigger overlay={<Tooltip>{row.sub_module_name} </Tooltip>}>
  //             <div>
  //               <span className="ms-1 d-block">
  //                 {' '}
  //                 {row.sub_module_name &&
  //                 row?.sub_module?.module_name?.length < 20
  //                   ? row?.sub_module?.module_name
  //                   : row?.sub_module?.module_name.substring(0, 50) + '....'}
  //               </span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     header: (column, sortDirection) => (
  //       <div className="d-flex align-items-center">
  //         <span>{column.name}</span>
  //         <i className="icofont-history cp bg-warning rounded-circle ms-2" />
  //       </div>
  //     )
  //   },

  //   {
  //     name: (
  //       <div>
  //         <span>Function</span>
  //         <i
  //           onClick={(e) =>
  //             handleFilterClick(e, 'function_name', 'Function', 'text')
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['function_name'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),
  //     selector: (row) => row?.function_master?.function_name,
  //     width: '7rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row?.function_master?.function_name && (
  //           <OverlayTrigger
  //             overlay={
  //               <Tooltip>{row?.function_master?.function_name} </Tooltip>
  //             }
  //           >
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {row?.function_master?.function_name &&
  //                 row?.function_master?.function_name?.length < 20
  //                   ? row?.function_master?.function_name
  //                   : row?.function_master?.function_name.substring(0, 50) +
  //                     '....'}
  //               </span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     header: (column) => (
  //       <div className="d-flex align-items-center">
  //         <span>{column.name}</span>
  //         <i className="icofont-history cp bg-warning rounded-circle ms-2" />
  //       </div>
  //     )
  //   },

  //   {
  //     name: (
  //       <div>
  //         <span>Field</span>
  //         <i
  //           onClick={(e) => handleFilterClick(e, 'field', 'Field', 'text')}
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['field'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),
  //     selector: (row) => row.field,
  //     width: '7rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.field && (
  //           <OverlayTrigger overlay={<Tooltip>{row.field} </Tooltip>}>
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {row.field && row.field?.length < 20
  //                   ? row.field
  //                   : row.field.substring(0, 50) + '....'}
  //               </span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     header: (column, sortDirection) => (
  //       <div className="d-flex align-items-center">
  //         <span>{column.name}</span>
  //         <i className="icofont-history cp bg-warning rounded-circle ms-2" />
  //       </div>
  //     )
  //   },

  //   {
  //     name: (
  //       <div>
  //         <span>Testing Type</span>
  //         <i
  //           onClick={(e) =>
  //             handleFilterClick(e, 'type_name', 'Testing Type', 'text')
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['type_name'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),
  //     selector: (row) => row?.testing_type?.type_name,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row?.testing_type?.type_name && (
  //           <OverlayTrigger
  //             overlay={<Tooltip>{row?.testing_type?.type_name} </Tooltip>}
  //           >
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {row?.testing_type?.type_name &&
  //                 row?.testing_type?.type_name?.length < 20
  //                   ? row?.testing_type?.type_name
  //                   : row?.testing_type?.type_name.substring(0, 50) + '....'}
  //               </span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     header: (column, sortDirection) => (
  //       <div className="d-flex align-items-center">
  //         <span>{column.name}</span>
  //         <i className="icofont-history cp bg-warning rounded-circle ms-2" />
  //       </div>
  //     )
  //   },

  //   {
  //     name: (
  //       <div>
  //         <span>Testing Group</span>
  //         <i
  //           onClick={(e) =>
  //             handleFilterClick(e, 'group_name', 'Testing Group', 'text')
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['group_name'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),
  //     selector: (row) => row.group_name,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.group_name && (
  //           <OverlayTrigger overlay={<Tooltip>{row.group_name} </Tooltip>}>
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {row.group_name && row.group_name?.length < 20
  //                   ? row.group_name
  //                   : row.group_name.substring(0, 50) + '....'}
  //               </span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     header: (column, sortDirection) => (
  //       <div className="d-flex align-items-center">
  //         <span>{column.name}</span>
  //         <i className="icofont-history cp bg-warning rounded-circle ms-2" />
  //       </div>
  //     )
  //   },

  //   {
  //     name: (
  //       <div>
  //         <span>Testing Id</span>
  //         <i
  //           onClick={(e) =>
  //             handleFilterClick(e, 'tc_id', 'Testing Id', 'number')
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['tc_id'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),
  //     selector: (row) => row.tc_id,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.tc_id && (
  //           <OverlayTrigger overlay={<Tooltip>{row.tc_id} </Tooltip>}>
  //             <div>
  //               <span className="ms-1">{row.tc_id}</span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     header: (column, sortDirection) => (
  //       <div className="d-flex align-items-center">
  //         <span>{column.name}</span>
  //         <i className="icofont-history cp bg-warning rounded-circle ms-2" />
  //       </div>
  //     )
  //   },

  //   {
  //     name: (
  //       <div>
  //         <span>Severity</span>
  //         <i
  //           onClick={(e) =>
  //             handleFilterClick(e, 'severity', 'Severity', 'text')
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['severity'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),
  //     selector: (row) => row.severity,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.severity && (
  //           <OverlayTrigger overlay={<Tooltip>{row.severity} </Tooltip>}>
  //             <div>
  //               <span className="ms-1">{row.severity}</span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     header: (column, sortDirection) => (
  //       <div className="d-flex align-items-center">
  //         <span>{column.name}</span>
  //         <i className="icofont-history cp bg-warning rounded-circle ms-2" />
  //       </div>
  //     )
  //   },

  //   {
  //     name: (
  //       <div>
  //         <span>Test Description</span>
  //         <i
  //           onClick={(e) =>
  //             handleFilterClick(
  //               e,
  //               'test_description',
  //               'test_description',
  //               'text'
  //             )
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['test_description'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),
  //     selector: (row) => row.test_description,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.test_description && (
  //           <OverlayTrigger
  //             overlay={<Tooltip>{row.test_description} </Tooltip>}
  //           >
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {row.test_description && row.test_description?.length < 20
  //                   ? row.test_description
  //                   : row.test_description.substring(0, 50) + '....'}
  //               </span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     header: (column, sortDirection) => (
  //       <div className="d-flex align-items-center">
  //         <span>{column.name}</span>
  //         <i className="icofont-history cp bg-warning rounded-circle ms-2" />
  //       </div>
  //     )
  //   },
  //   {
  //     name: (
  //       <div>
  //         <span>Steps</span>
  //         <i
  //           onClick={(e) => handleFilterClick(e, 'steps', 'Steps', 'text')}
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['steps'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),
  //     selector: (row) => row.steps,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.steps && (
  //           <OverlayTrigger overlay={<Tooltip>{row.steps} </Tooltip>}>
  //             <div>
  //               <span className="ms-1 d-block">
  //                 {' '}
  //                 {row.steps && row?.testing_type?.type_name?.length < 20
  //                   ? row.steps
  //                   : row.steps.substring(0, 50) + '....'}
  //               </span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     header: (column, sortDirection) => (
  //       <div className="d-flex align-items-center">
  //         <span>{column.name}</span>
  //         <i className="icofont-history cp bg-warning rounded-circle ms-2" />
  //       </div>
  //     )
  //   },

  //   {
  //     name: (
  //       <div>
  //         <span>Expected Result</span>
  //         <i
  //           onClick={(e) =>
  //             handleFilterClick(e, 'expected_result', 'Expected Result', 'text')
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['expected_result'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),
  //     selector: (row) => row.expected_result,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.expected_result && (
  //           <OverlayTrigger overlay={<Tooltip>{row.expected_result} </Tooltip>}>
  //             <div>
  //               <span className="ms-1 d-block">
  //                 {' '}
  //                 {row.expected_result && row.expected_result?.length < 20
  //                   ? row.expected_result
  //                   : row.expected_result.substring(0, 50) + '....'}
  //               </span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     header: (column, sortDirection) => (
  //       <div className="d-flex align-items-center">
  //         <span>{column.name}</span>
  //         <i className="icofont-history cp bg-warning rounded-circle ms-2" />
  //       </div>
  //     )
  //   },

  //   {
  //     name: (
  //       <div>
  //         <span>Status</span>
  //         <i
  //           onClick={(e) => handleFilterClick(e, 'status', 'Status', 'text')}
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['status'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),
  //     selector: (row) => row.tai_bc_status_conventions?.convention_name,
  //     width: '7rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.tai_bc_status_conventions?.convention_name && (
  //           <OverlayTrigger
  //             overlay={
  //               <Tooltip>
  //                 {row.tai_bc_status_conventions?.convention_name}{' '}
  //               </Tooltip>
  //             }
  //           >
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {row.tai_bc_status_conventions?.convention_name &&
  //                 row.tai_bc_status_conventions?.convention_name?.length < 20
  //                   ? row.tai_bc_status_conventions?.convention_name
  //                   : row.tai_bc_status_conventions?.convention_name.substring(
  //                       0,
  //                       50
  //                     ) + '....'}
  //               </span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     header: (column, sortDirection) => (
  //       <div className="d-flex align-items-center">
  //         <span>{column.name}</span>
  //         <i className="icofont-history cp bg-warning rounded-circle ms-2" />
  //       </div>
  //     )
  //   },

  //   {
  //     name: 'Reviewer comment',
  //     selector: (row) => row?.comment_id,
  //     sortable: true,

  //     width: '250px',
  //     // cell: (row) => (
  //     //     <select
  //     //       className="form-select"
  //     //       aria-label="Default select example"
  //     //       value={row.comment_id || ''}
  //     //       id="comment_id"
  //     //       name="comment_id"
  //     //       disabled
  //     //     >
  //     //       {generateOptions(getFilterReviewCommentMasterList)}
  //     //     </select>
  //     // )
  //     cell: (row) => {
  //       // Get the selected option text to display in the tooltip
  //       const selectedOptionText =
  //         getFilterReviewCommentMasterList?.find(
  //           (option) => option?.value === row?.comment_id
  //         )?.label || 'No comment selected';

  //       return (
  //         <OverlayTrigger overlay={<Tooltip>{selectedOptionText}</Tooltip>}>
  //           <select
  //             className="form-select"
  //             aria-label="Default select example"
  //             value={row.comment_id || ''}
  //             id="comment_id"
  //             name="comment_id"
  //             disabled
  //           >
  //             {generateOptions(getFilterReviewCommentMasterList)}
  //           </select>
  //         </OverlayTrigger>
  //       );
  //     }
  //   },
  //   {
  //     name: 'Remark',
  //     selector: (row) => row?.remark,
  //     sortable: true,
  //     width: '300px',
  //     cell: (row) => (
  //       <OverlayTrigger overlay={<Tooltip>{row.other_remark}</Tooltip>}>
  //         <input
  //           className="form-control"
  //           type="text"
  //           id="other_remark"
  //           name="other_remark"
  //           placeholder="Enter Remark"
  //           aria-label="default input example"
  //           defaultValue={row.other_remark}
  //           disabled
  //         />
  //       </OverlayTrigger>
  //     )
  //   },

  //   {
  //     name: (
  //       <div>
  //         <span>Project</span>
  //         <i
  //           onClick={(e) =>
  //             handleFilterClick(e, 'project_name', 'Project', 'text')
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['project_name'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),
  //     selector: (row) => row?.project?.project_name,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row?.project?.project_name && (
  //           <OverlayTrigger
  //             overlay={<Tooltip>{row?.project?.project_name} </Tooltip>}
  //           >
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {row?.project?.project_name &&
  //                 row?.project?.project_name?.length < 20
  //                   ? row?.project?.project_name
  //                   : row?.project?.project_name.substring(0, 50) + '....'}
  //               </span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     header: (column, sortDirection) => (
  //       <div className="d-flex align-items-center">
  //         <span>{column.name}</span>
  //         <i className="icofont-history cp bg-warning rounded-circle ms-2" />
  //       </div>
  //     )
  //   },

  //   {
  //     name: (
  //       <div>
  //         <span>Created At</span>
  //         <i
  //           onClick={(e) =>
  //             handleFilterClick(e, 'created_at', 'created_at', 'text')
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['created_at'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),
  //     selector: (row) => row.created_at,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.created_at && (
  //           <OverlayTrigger overlay={<Tooltip>{row.created_at} </Tooltip>}>
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {row.created_at && row.created_at?.length < 20
  //                   ? row.created_at
  //                   : row.created_at.substring(0, 50) + '....'}
  //               </span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     header: (column, sortDirection) => (
  //       <div className="d-flex align-items-center">
  //         <span>{column.name}</span>
  //         <i className="icofont-history cp bg-warning rounded-circle ms-2" />
  //       </div>
  //     )
  //   },

  //   {
  //     name: (
  //       <div>
  //         <span>Created By</span>
  //         <i
  //           onClick={(e) =>
  //             handleFilterClick(e, 'created_by', 'created_by', 'text')
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['created_by'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),
  //     selector: (row) =>
  //       row?.created_by
  //         ? `${row?.created_by?.first_name} ${row?.created_by?.last_name}`
  //         : '',
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => {
  //       const fullName = row?.created_by
  //         ? `${row?.created_by?.first_name} ${row?.created_by?.last_name}`
  //         : '';
  //       return (
  //         <div
  //           className="btn-group"
  //           role="group"
  //           aria-label="Basic outlined example"
  //         >
  //           {fullName && (
  //             <OverlayTrigger overlay={<Tooltip>{fullName}</Tooltip>}>
  //               <div>
  //                 <span className="ms-1">
  //                   {fullName?.length < 20
  //                     ? fullName
  //                     : fullName?.substring(0, 50) + '...'}
  //                 </span>
  //               </div>
  //             </OverlayTrigger>
  //           )}
  //         </div>
  //       );
  //     },
  //     header: (column, sortDirection) => (
  //       <div className="d-flex align-items-center">
  //         <span>{column.name}</span>
  //         <i className="icofont-history cp bg-warning rounded-circle ms-2" />
  //       </div>
  //     )
  //   }
  // ];

  const columns = [
    {
      accessorKey: 'action',
      header: 'Action',
      size: 110,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableSorting: false,
      muiTableBodyCellProps: {
        align: 'center'
      },
      enableColumnFilter: false,
      Cell: ({ row }) => {
        if (
          !row ||
          row?.original?.tc_id === null ||
          row?.original?.status === null
        )
          return null;
        return (
          <div className="d-flex align-items-center">
            <i
              className="icofont-edit text-primary btn btn-outline-secondary cp "
              onClick={() =>
                setAddEditTestCasesModal({
                  type: 'EDIT',
                  data: row?.original,
                  open: true,
                  id: row?.original?.id
                })
              }
            />
            <Link
              to={`/${
                _base + '/TestCaseHistoryComponent/' + row?.original?.id
              }`}
            >
              <i class="icofont-history cp btn btn-outline-secondary fw-bold  " />
            </Link>
          </div>
        );
      }
    },

    {
      accessorFn: (originalRow) => originalRow?.tc_id || '--',
      header: 'selectAll',
      Header: (
        <div onClick={handleSelectAllNamesChange}>
          <input
            type="checkbox"
            checked={selectAllNames}
            onChange={handleSelectAllNamesChange}
          />
        </div>
      ),
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnOrdering: false,
      enableGrouping: false,
      size: 80,
      Cell: ({ row }) => {
        const rowData = row.original;

        return (
          <input
            type="checkbox"
            checked={selectedRows.includes(rowData.id)}
            onChange={() => handleCheckboxChange(rowData)}
          />
        );
      }
    },

    {
      accessorFn: (originalRows) =>
        `${originalRows?.module?.module_name || '--'} `,
      header: 'Module Name',
      Header: (
        <span>
          Module Name
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'module_name', 'Module Name', 'text')
            }
          />
        </span>
      ),
      enableColumnFilter: false,
      size: 200,
      enableSorting: false
    },
    {
      accessorFn: (originalRows) =>
        `${originalRows?.sub_module?.sub_module_name || '--'} `,
      header: 'Submodule Name',
      Header: (
        <span>
          Submodule Name
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'sub_module_name', 'Submodule Name', 'text')
            }
          />
        </span>
      ),
      enableColumnFilter: false,
      size: 220,
      enableSorting: false
    },
    {
      accessorFn: (originalRows) => `${originalRows?.platform || '--'} `,
      header: 'platform',
      Header: (
        <span>
          Platform
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'platform', 'Platform', 'text')
            }
          />
        </span>
      ),
      enableColumnFilter: false,
      size: 200,
      enableSorting: false
    },
    {
      accessorFn: (originalRows) =>
        `${originalRows?.function_master?.function_name || '--'} `,
      header: 'Function Name',
      Header: (
        <span>
          Function Name
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'function_name', 'Function Name', 'text')
            }
          />
        </span>
      ),
      enableColumnFilter: false,
      size: 200,
      enableSorting: false
    },
    {
      accessorFn: (originalRows) => `${originalRows?.field || '--'} `,
      header: 'Field',
      Header: (
        <span>
          Field
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) => handleFilterClick(e, 'field', 'Field', 'text')}
          />
        </span>
      ),
      enableColumnFilter: false,
      size: 200,
      enableSorting: false
    },

    {
      accessorFn: (originalRows) =>
        `${originalRows?.testing_type?.type_name || '--'} `,
      header: 'Testing Type',
      Header: (
        <span>
          Testing Type
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'type_name', 'Testing Type', 'text')
            }
          />
        </span>
      ),
      enableColumnFilter: false,
      size: 200,
      enableSorting: false
    },
    {
      accessorFn: (originalRows) => `${originalRows?.testing_group || '--'} `,
      header: 'Testing Group',
      Header: (
        <span>
          Testing Group
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'group_name', 'Testing Group', 'text')
            }
          />
        </span>
      ),
      enableColumnFilter: false,
      size: 200,
      enableSorting: false
    },
    {
      accessorFn: (originalRows) => `${originalRows?.tc_id || '--'} `,
      header: 'Test Id',
      Header: (
        <span>
          Test Id
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) => handleFilterClick(e, 'tc_id', 'Test Id', 'text')}
          />
        </span>
      ),
      enableColumnFilter: false,
      size: 200,
      enableSorting: false
    },
    {
      accessorFn: (originalRows) => `${originalRows?.severity || '--'} `,
      header: 'Severity',
      Header: (
        <span>
          Severity
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'severity', 'Severity', 'text')
            }
          />
        </span>
      ),
      enableColumnFilter: false,
      size: 200,
      enableSorting: false
    },
    {
      accessorFn: (originalRows) =>
        `${originalRows?.test_description || '--'} `,
      header: 'Test Description',
      Header: (
        <span>
          Test Description
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(
                e,
                'test_description',
                'Test Description',
                'text'
              )
            }
          />
        </span>
      ),
      enableColumnFilter: false,
      size: 200,
      enableSorting: false
    },
    {
      accessorFn: (originalRows) => `${originalRows?.steps || '--'} `,
      header: 'Steps',
      Header: (
        <span>
          Steps
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) => handleFilterClick(e, 'steps', 'Steps', 'text')}
          />
        </span>
      ),
      enableColumnFilter: false,
      size: 200,
      enableSorting: false
    },
    {
      accessorFn: (originalRows) => `${originalRows?.expected_result || '--'} `,
      header: 'Expected Result',
      Header: (
        <span>
          Expected Result
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'expected_result', 'Expected Result', 'text')
            }
          />
        </span>
      ),
      enableColumnFilter: false,
      size: 200,
      enableSorting: false
    },
    {
      accessorFn: (originalRows) =>
        `${originalRows?.tai_bc_status_conventions?.convention_name || '--'} `,
      header: 'Status',
      Header: (
        <span>
          Status
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'status_name', 'Status', 'text')
            }
          />
        </span>
      ),
      enableColumnFilter: false,
      size: 200,
      enableSorting: false
    },

    //   {
    //   name: 'Reviewer comment',
    //   selector: (row) => row?.comment_id,
    //   sortable: true,

    //   width: '250px',

    //   cell: (row) => {

    //     const selectedOptionText =
    //       getFilterReviewCommentMasterList?.find(
    //         (option) => option?.value === row?.comment_id
    //       )?.label || 'No comment selected';

    //     return (
    //       <OverlayTrigger overlay={<Tooltip>{selectedOptionText}</Tooltip>}>
    //         <select
    //           className="form-select"
    //           aria-label="Default select example"
    //           value={row.comment_id || ''}
    //           id="comment_id"
    //           name="comment_id"
    //           disabled
    //         >
    //           {generateOptions(getFilterReviewCommentMasterList)}
    //         </select>
    //       </OverlayTrigger>
    //     );
    //   }
    // },
    {
      accessorFn: (originalRow) => originalRow?.comment_id || '--',
      header: 'Reviewer comment',
      Header: (
        <span>
          Reviewer comment
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'comment_id', 'Reviewer comment', 'dropdown')
            }
          />
        </span>
      ),
      enableColumnFilter: false,
      enableSorting: true,
      size: 250,
      Cell: ({ row }) => {
        const rowData = row.original;
        const selectedOptionText =
          getFilterReviewCommentMasterList?.find(
            (option) => option?.value === rowData?.comment_id
          )?.label || 'No comment selected';

        return (
          <OverlayTrigger overlay={<Tooltip>{selectedOptionText}</Tooltip>}>
            <select
              className="form-select"
              aria-label="Default select example"
              value={rowData.comment_id || ''}
              id="comment_id"
              name="comment_id"
              disabled
            >
              {generateOptions(getFilterReviewCommentMasterList)}
            </select>
          </OverlayTrigger>
        );
      }
    },

    {
      accessorFn: (originalRow) => originalRow?.remark || '--',
      header: 'Remark',
      Header: (
        <span>
          Remark
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) => handleFilterClick(e, 'remark', 'Remark', 'text')}
          />
        </span>
      ),
      enableColumnFilter: false,
      enableSorting: true,
      size: 300,
      Cell: ({ row }) => {
        const rowData = row.original;

        return (
          <OverlayTrigger overlay={<Tooltip>{rowData.other_remark}</Tooltip>}>
            <input
              className="form-control"
              type="text"
              id="other_remark"
              name="other_remark"
              placeholder="Enter Remark"
              aria-label="default input example"
              defaultValue={rowData.other_remark}
              disabled
            />
          </OverlayTrigger>
        );
      }
    },

    {
      accessorFn: (originalRows) =>
        `${originalRows?.project?.project_name || '--'} `,
      header: 'Project',
      Header: (
        <span>
          Project
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'project_name', 'Project', 'text')
            }
          />
        </span>
      ),
      enableColumnFilter: false,
      size: 200,
      enableSorting: false
    },
    {
      accessorFn: (originalRows) => `${originalRows?.created_at || '--'} `,
      header: 'Created At',
      Header: (
        <span>
          Created At
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'created_at', 'Created At', 'text')
            }
          />
        </span>
      ),
      enableColumnFilter: false,
      size: 200,
      enableSorting: false
    },

    {
      accessorFn: (originalRows) =>
        `${originalRows?.created_by?.first_name || '--'} ${
          originalRows?.created_by?.last_name || '--'
        }`,
      header: 'Created By',
      Header: (
        <span>
          Created By
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'created_by', 'Created By', 'text')
            }
          />
        </span>
      ),
      enableColumnFilter: false,
      size: 200,
      enableSorting: false
    },
    {
      accessorFn: (originalRows) => `${originalRows?.updated_at || '--'} `,
      header: 'Updated At',
      Header: (
        <span>
          Updated At
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'updated_at', 'Updated At', 'text')
            }
          />
        </span>
      ),
      enableColumnFilter: false,
      size: 200,
      enableSorting: false
    },
    {
      accessorFn: (originalRows) =>
        `${originalRows?.updated_by?.first_name || '--'} ${
          originalRows?.updated_by?.last_name || '--'
        }`,
      header: 'Updated By',
      Header: (
        <span>
          Updated By
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'updated_by', 'Updated By', 'text')
            }
          />
        </span>
      ),
      enableColumnFilter: false,
      size: 200,
      enableSorting: false
    }
  ];


   const transformDataForReviewTestDraft = (data) => {
    return data?.length > 0 && data?.map((originalRows) => ({
       ...originalRows,
       module_name: originalRows?.module?.module_name || '-',
       sub_module_name: originalRows?.sub_module?.sub_module_name || '-',
       function_name: originalRows?.function_master?.function_name || '-',
       "Testing Type": originalRows?.testing_type?.type_name || '-',
       group_name: originalRows?.testing_group || '-',
       project_name: originalRows?.project?.project_name || '-',
        'Created By': `${originalRows?.created_by?.first_name || '-'} ${
        originalRows?.created_by?.last_name || '-'
      }`,
        'Updated By': `${originalRows?.updated_by?.first_name || '-'} ${
        originalRows?.updated_by?.last_name || '-'
      }`
    }))
    }


  const exportColumns = [
    { title: 'Module', field: 'module_name' },
    { title: 'Submodule', field: 'sub_module_name' },
    { title: 'Function', field: 'function_name' },
    { title: 'Field', field: 'field' },
    { title: 'Testing Type', field: 'type_name' },
    { title: 'Testing Group', field: 'group_name' },
    { title: 'Test ID', field: 'tc_id' },
    { title: 'Test Description', field: 'test_description' },
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
      reviewer_id: reviewerId,
      status_id: testCasesStatusDataList?.find(
        (d) => d.convention_name === 'MODIFIED'
      )?.id
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
              limit: paginationData.pageSize,
              page: paginationData.pageIndex + 1
            })
          );
          dispatch(
            getByTestPlanIDReviewedListThunk({
              id: id,
              limit: paginationData.pageSize,
              page: paginationData.pageIndex + 1
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
      filterType === 'is not between' ||
      filterType === 'is between' ||
      selectedValue === 'is between' ||
      selectedValue === 'is not between'
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

    // const updatedFilters = [...filters, newFilter];
    const getLatestConditions = (data) => {
      const latestConditions = {};

      // Traverse the list to keep the most recent condition for each column
      data.forEach((condition) => {
        const column = condition.column;
        latestConditions[column] = condition;
      });

      // Convert the dictionary back to a list
      const latestConditionsList = Object.values(latestConditions);

      return latestConditionsList;
    };
    const updatedFiltersData = [...filters, newFilter];

    const updatedFilters = getLatestConditions(updatedFiltersData);
    dispatch(
      getByTestPlanIDReviewedListThunk({
        id: id,
        limit: paginationData.pageSize,
        page: paginationData.pageIndex + 1,
        filter_testcase_data:
          updatedFilters?.length === 1 &&
          updatedFilters[0]?.column === filterColumnId
            ? []
            : updatedFilters
      })
    );
  }, [paginationData.rowPerPage, paginationData.currentPage]);
  const [clearData, setClearData] = useState(false);

  const handleButtonClick = () => {
    setIsFilterApplied(false);

    setClearData(true);
    setPaginationData({
      pageSize: 100,
      pageIndex: 0
    });
    dispatch(
      getByTestPlanIDReviewedListThunk({
        id: id,
        limit: 10,
        page: 1
      })
    );
  };
  useEffect(() => {
    if (sortOrder && sortOrder != null) {
      // handleApplyFilter(sortOrder);
      const newFilter =
        filterType === 'is not between' ||
        filterType === 'is between' ||
        selectedValue === 'is between' ||
        selectedValue === 'is not between'
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

      // const updatedFilters = [...filters, newFilter];
      const getLatestConditions = (data) => {
        const latestConditions = {};

        // Traverse the list to keep the most recent condition for each column
        data.forEach((condition) => {
          const column = condition.column;
          latestConditions[column] = condition;
        });

        // Convert the dictionary back to a list
        const latestConditionsList = Object.values(latestConditions);

        return latestConditionsList;
      };
      const updatedFiltersData = [...filters, newFilter];

      const updatedFilters = getLatestConditions(updatedFiltersData);
      localDispatch({ type: 'SET_FILTERS', payload: updatedFilters });
      setIsFilterApplied((prev) => ({
        ...prev,
        [filterColumnId]: true
      }));
      try {
        dispatch(
          getByTestPlanIDReviewedListThunk({
            id: id,
            limit: paginationData.pageSize,
            page: paginationData.pageIndex + 1,
            filter_testcase_data: updatedFilters
          })
        );
        localDispatch({ type: 'SET_MODAL_IS_OPEN', payload: false });
        localDispatch({ type: 'SET_SEARCH_TERM', payload: '' });
        localDispatch({ type: 'SET_SELECTED_FILTER', payload: [] });
      } catch (error) {}
    }
  }, [sortOrder]);

  useEffect(() => {
    dispatch(
      getExportAllReviewTestDraftList({
        id: id,
        type: 'ALL'
      })
    );
  }, []);
  useEffect(() => {
    dispatch(
      getTestCaseStatusDataList({
        limit: paginationData.pageSize,
        page: paginationData.pageIndex + 1
      })
    );
  }, [paginationData.pageSize, paginationData.pageIndex]);

  return (
    <div className="container-xxl">
      <PageHeader
        showBackBtn
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
                apiData={transformDataForReviewTestDraft(allReviewDraftTestListDataByID)}
                columns={exportColumns}
                fileName="Reviewed Test Draft List"
                disabled={allReviewDraftTestListDataByID?.length === 0}
              />
            </div>
          );
        }}
      />

      <Container fluid className="mt-3">
        {/* <h5 className="mb-0 text-primary">Test Cases</h5>
        <hr className="primary_divider mt-1" /> */}
        {/* <DataTable
          columns={columns}
          data={allReviewDraftTestListDataByID}
          persistTableHead={true}
          defaultSortField="role_id"
          pagination
          selectableRows={false}
          paginationServer
          paginationTotalRows={allReviewDraftTestListDataTotal?.data?.total}
          paginationDefaultPage={paginationData?.currentPage}
          onChangePage={(page) => setPaginationData({ currentPage: page })}
          onChangeRowsPerPage={(newPageSize) => {
            setPaginationData({ rowPerPage: newPageSize });
            setPaginationData({ currentPage: 1 });
          }}
          paginationRowsPerPageOptions={[10, 15, 20, 25, 30]}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
        /> */}

        <MaterialTable
          columns={columns}
          data={allReviewDraftTestListDataByID || []}
          // isLoading={isLoading}
          pagination={paginationData}
          setPagination={setPaginationData}
          muiPaginationProps={{
            rowsPerPageOptions: [100, 500, 1000, 2000]
          }}
          totalRows={allReviewDraftTestListDataByID?.total}
          manualPagination={true}
          isExportData={false}
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
            // handleSendToReviewerModal({
            //   showModal: true,
            //   modalData: '',
            //   modalHeader: 'Send To Reviewer Modal'
            // });
            if (selectAllNames !== true) {
              alert(
                'Please select all test cases to send for review, partial selection is not allowed.'
              );
              return; // Exit the function or prevent further execution
            }
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
          muiPaginationProps={{ rowsPerPageOptions: [10, 50, 100, 150, 200] }}
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
            classNamePrefix="react-select"
            id="reviewer_id"
            name="reviewer_id"
            options={filterTestData}
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
            className="btn btn bg-success text-white"
            onClick={() => handleSubmit()}
          >
            <i class="icofont-paper-plane "></i> {''}
            Send To Reviewer
          </button>

          <button
            type="button"
            className="btn bg-danger p-1.5 text-white"
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
          setSelectedValue={setSelectedValue}
          selectedValue={selectedValue}
        />
      )}
    </div>
  );
}

export default ReviewedTestDraftComponent;
