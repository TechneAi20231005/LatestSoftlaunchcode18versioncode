import React, { useEffect, useReducer, useState } from 'react';
import { Container, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import PageHeader from '../../../components/Common/PageHeader';
import {
  getReviewTestCasesData,
  getTestCaseReviewListThunk
} from '../../../redux/services/testCases/testCaseReview';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import CustomFilterModal from '../Modal/CustomFilterModal';
import { Astrick } from '../../../components/Utilities/Style';
import Select from 'react-select';
import { sendTestPlanReviewerThunk } from '../../../redux/services/testCases/downloadFormatFile';
import { getEmployeeData } from '../../Dashboard/DashboardAction';
import { toast } from 'react-toastify';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
import { Box } from '@mui/material';

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
  betweenValues: ['', ''],
  isFilterApplied: false,
  hasOpenedFilter: {}
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
    case 'SET_IS_FILTER_APPLIED':
      return { ...state, isFilterApplied: action.payload };
    case 'SET_HAS_OPENED_FILTER':
      return {
        ...state,
        hasOpenedFilter: action.payload
      };
    default:
      return state;
  }
}

function TestCaseReviewComponent() {
  const dispatch = useDispatch();
  // const [paginationData, setPaginationData] = useReducer(
  //   (prevState, nextState) => {
  //     return { ...prevState, ...nextState };
  //   },
  //   { rowPerPage: 10, currentPage: 1, currentFilterData: {} }
  // );
  const [paginationData, setPaginationData] = useState({
    pageIndex: 0,
    pageSize: 10
  });
  const {
    testCaseReviewList,
    isLoading,
    filterTestCaseReviewList,
    totalCount
  } = useSelector((state) => state?.testCaseReview);

  const [state, localDispatch] = useReducer(localReducer, initialState);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const testerData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.getAllTesterDataList
  );
  const filterTestData = testerData?.filter(
    (d) => d?.value != localStorage?.getItem('id')
  );
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
    tester_name: 'tester_id',
    total_testcases: 'total_testcases',
    total_reviewed_testcases: 'total_reviewed_testcases',
    total_rejected_testcases: 'total_rejected_testcases',
    total_approved_testcases: 'total_approved_testcases',
    created_at: 'created_at',
    created_by: 'created_by',
    updated_at: 'updated_at',
    updated_by: 'updated_by'
  };
  const [selectedStatus, setSelectedStatus] = useState(null);
  const options = [
    {
      value: 1,
      label: 'TOTAL'
    },
    {
      value: 2,
      label: 'REJECTED'
    },
    {
      value: 3,
      label: 'APPROVED'
    }
  ];

  const handleStatusChange = (selectedOption) => {
    setSelectedStatus(selectedOption);
  };
  const handleFilterClick = (event, column, name, type, id) => {
    if (clearData === true) {
      localDispatch({ type: 'SET_FILTERS', payload: [] });
    }
    const filterKeyMap = {
      test_plan_id: 'test_plan_ids',
      tester_name: 'tester_names',
      total_testcases: 'total_testcases',
      total_reviewed_testcases: 'total_reviewed_testcases',
      total_rejected_testcases: 'total_rejected_testcases',
      total_approved_testcases: 'total_approved_testcases',
      created_at: 'created_at',
      created_by: 'created_by',
      updated_at: 'updated_at',
      updated_by: 'updated_by'
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
    if (!state.hasOpenedFilter[column]) {
      localDispatch({
        type: 'SET_SELECTED_FILTER',
        payload: filteredData?.map((item) => item?.name)
      });
      localDispatch({
        type: 'SET_SELECTED_FILTER_IDS',
        payload: filteredData?.map((item) => item?.id)
      });
    }

    // ✅ Mark column as opened
    localDispatch({
      type: 'SET_HAS_OPENED_FILTER',
      payload: { ...state.hasOpenedFilter, [column]: true }
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
        payload: [
          ...state?.selectedFilters?.filter((filter) => filter !== label)
        ]
      });

      localDispatch({
        type: 'SET_SELECTED_FILTER_IDS',
        payload: state?.selectedFilterIds?.filter(
          (filterId) => filterId !== value
        )
      });
      localDispatch({
        type: 'SET_IS_FILTER_APPLIED',
        payload: true
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
    item?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  // const filteredResults = filterValues?.filter((item) =>
  //   item?.toString().includes(searchTerm?.toString())
  // );

  const handleSelectAll = (event) => {
    localDispatch({
      type: 'SET_IS_FILTER_APPLIED',
      payload: true
    });
    if (event.target.checked) {
      localDispatch({
        type: 'SET_SELECTED_FILTER',
        payload: filterValues?.map((item) => item?.name)
      });

      localDispatch({
        type: 'SET_SELECTED_FILTER_IDS',
        payload: filterValues?.map((item) => item.id)
      });
    } else {
      localDispatch({ type: 'SET_SELECTED_FILTER', payload: [] });

      localDispatch({ type: 'SET_SELECTED_FILTER_IDS', payload: [] });
      localDispatch({
        type: 'SET_IS_FILTER_APPLIED',
        payload: true
      });
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
        getTestCaseReviewListThunk({
          limit: paginationData.pageSize,
          page: paginationData.pageIndex + 1,
          filter_testcase_data: updatedFilters,
          type: 'reviewer'
        })
      );
      localDispatch({ type: 'SET_MODAL_IS_OPEN', payload: false });
      localDispatch({ type: 'SET_SEARCH_TERM', payload: '' });
      localDispatch({ type: 'SET_SELECTED_FILTER', payload: [] });
    } catch (error) {}
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
        getTestCaseReviewListThunk({
          limit: paginationData.pageSize,
          page: paginationData.pageIndex + 1,
          filter_testcase_data: updatedFilters,
          type: 'reviewer'
        })
      );
      localDispatch({ type: 'SET_MODAL_IS_OPEN', payload: false });
      localDispatch({ type: 'SET_SEARCH_TERM', payload: '' });
      localDispatch({ type: 'SET_SELECTED_FILTER', payload: [] });
    } catch (error) {}
  };
  const handleApplyButton = async () => {
    setClearData(false);

    const newFilter = {
      column: filterColumnId,
      column_name: filterColumn,

      whereIn: selectedFilterIds,
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
      [filterColumn]: true
    }));

    try {
      dispatch(
        getTestCaseReviewListThunk({
          limit: paginationData.pageSize,
          page: paginationData.pageIndex + 1,
          filter_testcase_data: updatedFilters,
          type: 'reviewer'
        })
      );
      localDispatch({ type: 'SET_MODAL_IS_OPEN', payload: false });
      localDispatch({ type: 'SET_SEARCH_TERM', payload: '' });
      // localDispatch({ type: 'SET_SELECTED_FILTER', payload: [] });
    } catch (error) {}
  };

  // const columns = [
  //   {
  //     name: 'Sr. No.',
  //     selector: (row, index) => index + 1,
  //     sortable: false,
  //     width: '70px'
  //   },
  //   {
  //     name: 'Action',
  //     selector: (row) => {
  //       if (!row || row.tc_id === null || row.status === null) return null;
  //       return (
  //         <div className="d-flex align-items-center">
  //           <i
  //             // disabled={row.status !== 'DRAFT'}
  //             className={
  //               'icofont-edit text-primary btn btn-outline-secondary cp '
  //             }
  //             onClick={() => {
  //               handleSendToReviewerModal({
  //                 showModal: true,
  //                 modalData: row,
  //                 modalHeader: 'Send To Reviewer Modal'
  //               });
  //             }}
  //           />
  //           <Link to={`/${_base + '/TestPlanHistoryComponent/' + row?.id}`}>
  //             <i class="icofont-history cp btn btn-outline-secondary fw-bold  " />
  //           </Link>
  //           <div>
  //             <i
  //               class="icofont-download cp btn btn-outline-secondary"
  //               onClick={() => {
  //                 handleTestCaseData({
  //                   showModal: true,
  //                   modalData: row,
  //                   modalHeader: 'Send To Reviewer Modal'
  //                 });
  //               }}
  //             />
  //           </div>
  //         </div>
  //       );
  //     },
  //     sortable: false
  //   },

  //   {
  //     name: (
  //       <div>
  //         <span>Test Plan Id</span>
  //         <i
  //           onClick={(e) =>
  //             handleFilterClick(e, 'test_plan_id', 'test_plan_id', 'text')
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['test_plan_id'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),

  //     selector: (row) => row.test_plan_id,
  //     width: '10rem',
  //     sortable: false,
  //     //   cell: (row) => (

  //     //     <div
  //     //       className="btn-group"
  //     //       role="group"
  //     //       aria-label="Basic outlined example"
  //     //     >
  //     //       {row.test_plan_id && (
  //     //         <OverlayTrigger overlay={<Tooltip>{row.test_plan_id} </Tooltip>}>
  //     //           <div>
  //     //             <Link
  //     //               to={`/${_base + '/TestCaseReviewDetails/' + row?.id}`}
  //     //               className="link_underline_primary"
  //     //             >
  //     //               {row.test_plan_id}
  //     //             </Link>
  //     //           </div>
  //     //         </OverlayTrigger>
  //     //       )}
  //     //     </div>
  //     //   ),
  //     //   header: (column, sortDirection) => (
  //     //     <div className="d-flex align-items-center">
  //     //       <span>{column.name}</span>
  //     //       <i className="icofont-history cp bg-warning rounded-circle ms-2" />
  //     //     </div>
  //     //   )
  //     // },
  //     cell: (row) => {
  //       const reviewerId = localStorage.getItem('id');

  //       const isDisabled = row?.reviewer_id !== parseInt(reviewerId);

  //       return (
  //         <div
  //           className="btn-group"
  //           role="group"
  //           aria-label="Basic outlined example"
  //         >
  //           {row.test_plan_id && (
  //             <OverlayTrigger overlay={<Tooltip>{row.test_plan_id}</Tooltip>}>
  //               <div>
  //                 {isDisabled ? (
  //                   // ✅ Show as plain text if disabled
  //                   <span className="text-muted">{row.test_plan_id}</span>
  //                 ) : (
  //                   // ✅ Active link if not disabled
  //                   <Link
  //                     to={`/${_base + '/TestCaseReviewDetails/' + row?.id}`}
  //                     className="link_underline_primary"
  //                   >
  //                     {row.test_plan_id}
  //                   </Link>
  //                 )}
  //               </div>
  //             </OverlayTrigger>
  //           )}
  //         </div>
  //       );
  //     }
  //   },

  //   {
  //     name: (
  //       <div>
  //         <span>Tester Name</span>
  //         <i
  //           onClick={(e) =>
  //             handleFilterClick(e, 'tester_name', 'Tester Name', 'text')
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['tester_name'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),

  //     selector: (row) => row.tester_name,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.tester_name && (
  //           <OverlayTrigger overlay={<Tooltip>{row.tester_name} </Tooltip>}>
  //             <div>{row.tester_name}</div>
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
  //         <span>Total Testcase</span>
  //         <i
  //           onClick={(e) =>
  //             handleFilterClick(
  //               e,
  //               'total_testcases',
  //               'total_testcases',
  //               'number'
  //             )
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['total_testcases'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),

  //     selector: (row) => row.total_testcases,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.total_testcases && (
  //           <OverlayTrigger overlay={<Tooltip>{row.total_testcases} </Tooltip>}>
  //             <div>{row.total_testcases}</div>
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
  //         <span>Reviewed Testcase</span>
  //         <i
  //           onClick={(e) =>
  //             handleFilterClick(
  //               e,
  //               'total_reviewed_testcases',
  //               'total_reviewed_testcases',
  //               'number'
  //             )
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['total_reviewed_testcases']
  //               ? 'text-warning'
  //               : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),

  //     selector: (row) => row.total_reviewed_testcases,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.total_reviewed_testcases && (
  //           <OverlayTrigger
  //             overlay={<Tooltip>{row.total_reviewed_testcases} </Tooltip>}
  //           >
  //             <div>{row.total_reviewed_testcases}</div>
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
  //         <span>Rejected Testcase</span>
  //         <i
  //           onClick={(e) =>
  //             handleFilterClick(
  //               e,
  //               'total_rejected_testcases',
  //               'total_rejected_testcases',
  //               'number'
  //             )
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['total_rejected_testcases']
  //               ? 'text-warning'
  //               : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),

  //     selector: (row) => row.total_rejected_testcases,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.total_rejected_testcases && (
  //           <OverlayTrigger
  //             overlay={<Tooltip>{row.total_rejected_testcases} </Tooltip>}
  //           >
  //             <div>{row.total_rejected_testcases}</div>
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
  //         <span>Approved Testcase</span>
  //         <i
  //           onClick={(e) =>
  //             handleFilterClick(
  //               e,
  //               'total_approved_testcases',
  //               'total_approved_testcases',
  //               'number'
  //             )
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['total_approved_testcases']
  //               ? 'text-warning'
  //               : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),

  //     selector: (row) => row.total_approved_testcases,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.total_approved_testcases && (
  //           <OverlayTrigger
  //             overlay={<Tooltip>{row.total_approved_testcases} </Tooltip>}
  //           >
  //             <div>{row.total_approved_testcases}</div>
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
  //           onClick={(e, row) =>
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
  //         {row?.created_at && (
  //           <OverlayTrigger overlay={<Tooltip>{row.created_at} </Tooltip>}>
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {row?.created_at && row?.created_at?.length < 20
  //                   ? row?.created_at
  //                   : row?.created_at?.substring(0, 50) + '....'}
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
  //           onClick={(e, row) =>
  //             handleFilterClick(e, 'created_by', 'created_by', 'text')
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['created_by'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),
  //     selector: (row) => row.created_by,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row?.created_by && (
  //           <OverlayTrigger overlay={<Tooltip>{row.created_by} </Tooltip>}>
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {row?.created_by && row?.created_by?.length < 20
  //                   ? row?.created_by
  //                   : row?.created_by?.substring(0, 50) + '....'}
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
  //         <span>Updated At</span>
  //         <i
  //           onClick={(e, row) =>
  //             handleFilterClick(e, 'updated_at', 'updated_at', 'text')
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['updated_at'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),
  //     selector: (row) => row.updated_at,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row?.updated_at && (
  //           <OverlayTrigger overlay={<Tooltip>{row.updated_at} </Tooltip>}>
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {row?.updated_at && row?.updated_at?.length < 20
  //                   ? row?.updated_at
  //                   : row?.updated_at?.substring(0, 50) + '....'}
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
  //         <span>Updated By</span>
  //         <i
  //           onClick={(e, row) =>
  //             handleFilterClick(e, 'updated_by', 'updated_by', 'text')
  //           }
  //           className={`icofont-filter ms-2 ${
  //             isFilterApplied['updated_by'] ? 'text-warning' : 'text-dark'
  //           }`}
  //         />
  //       </div>
  //     ),
  //     selector: (row) => row.updated_by,
  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row?.updated_by && (
  //           <OverlayTrigger overlay={<Tooltip>{row.updated_by} </Tooltip>}>
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {row?.updated_by && row?.updated_by?.length < 20
  //                   ? row?.updated_by
  //                   : row?.updated_by?.substring(0, 50) + '....'}
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
  //   }
  // ];

  const columns = [
    {
      header: 'Action',
      id: 'action',
      enableColumnOrdering: false,
      enableGrouping: false,
      enableSorting: false,
      enableColumnFilter: false,
      size: 130,
      muiTableBodyCellProps: {
        align: 'center'
      },
      Cell: ({ row }) => {
        const rowData = row?.original;
        const isDisabled =
          rowData?.total_reviewed_testcases > 0 &&
          rowData?.total_rejected_testcases +
            rowData?.total_approved_testcases !==
            rowData?.total_reviewed_testcases;

        return (
          <div className="d-flex align-items-center">
            {/* <i

              className="icofont-paper-plane btn btn-outline-secondary icon-large mx-2 cp"
              onClick={() => {
                handleSendToReviewerModal({
                  showModal: true,
                  modalData: rowData,
                  modalHeader: 'Send To Reviewer Modal'
                });
              }}

            /> */}

            <i
              className={`icofont-paper-plane btn btn-outline-secondary icon-large mx-2 cp ${
                isDisabled ? 'disabled text-muted' : 'text-primary'
              }`}
              onClick={() => {
                if (isDisabled) return;
                handleSendToReviewerModal({
                  showModal: true,
                  modalData: rowData,
                  modalHeader: 'Send To Reviewer Modal'
                });
              }}
            />
            <Link to={`/${_base + '/TestPlanHistoryComponent/' + rowData?.id}`}>
              <i className="icofont-history cp btn btn-outline-secondary fw-bold" />
            </Link>
            <div>
              <i
                className="icofont-download cp btn btn-outline-secondary"
                onClick={() => {
                  handleTestCaseData({
                    showModal: true,
                    modalData: rowData,
                    modalHeader: 'Send To Reviewer Modal'
                  });
                }}
              />
            </div>
          </div>
        );
      }
    },
    {
      header: 'Test Plan Id',
      accessorKey: 'test_plan_id',
      size: 210,
      enableSorting: false,
      enableColumnFilter: true,
      Header: (
        <span>
          Test Plan ID
          <i
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'test_plan_id', 'test_plan_id', 'text')
            }
            className={`icofont-filter ms-2 ${
              isFilterApplied['test_plan_id'] ? 'text-warning' : 'text-dark'
            }`}
          />
        </span>
      ),
      Cell: ({ cell }) => {
        const rowData = cell.row.original;
        const reviewerId = localStorage.getItem('id');
        const isDisabled = rowData?.reviewer_id !== parseInt(reviewerId);

        return (
          <div
            className="btn-group"
            role="group"
            aria-label="Basic outlined example"
          >
            {rowData.test_plan_id && (
              <div>
                {isDisabled ? (
                  <span className="text-muted">{rowData.test_plan_id}</span>
                ) : (
                  <Link
                    to={`/${_base + '/TestCaseReviewDetails/' + rowData?.id}`}
                    className="link_underline_primary"
                  >
                    {rowData.test_plan_id}
                  </Link>
                )}
              </div>
            )}
          </div>
        );
      }
    },
    {
      header: 'Tester Name',
      accessorFn: (row) =>
        `${row.tester_name?.first_name} ${row.tester_name?.last_name}`, // Combine first and last name
      id: 'tester_name', // Needed when using accessorFn instead of accessorKey
      size: 188,
      enableSorting: false,
      enableColumnFilter: true,
      Header: (
        <span>
          Tester Name
          <i
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'tester_name', 'Tester Name', 'text')
            }
            className={`icofont-filter ms-2 ${
              isFilterApplied['tester_name'] ? 'text-warning' : 'text-dark'
            }`}
          />
        </span>
      )
    },

    {
      header: 'Total Testcase',
      accessorKey: 'total_testcases',
      size: 205,
      enableSorting: false,
      enableColumnFilter: true,
      Header: (
        <span>
          Total Testcase
          <i
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(
                e,
                'total_testcases',
                'total_testcases',
                'number'
              )
            }
            className={`icofont-filter ms-2 ${
              isFilterApplied['total_testcases'] ? 'text-warning' : 'text-dark'
            }`}
          />
        </span>
      )
    },
    {
      header: 'Reviewed Testcase',
      accessorKey: 'total_reviewed_testcases',
      size: 235,
      enableSorting: false,
      enableColumnFilter: true,
      Header: (
        <span>
          Reviewed Testcase
          <i
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(
                e,
                'total_reviewed_testcases',
                'total_reviewed_testcases',
                'number'
              )
            }
            className={`icofont-filter ms-2 ${
              isFilterApplied['total_reviewed_testcases']
                ? 'text-warning'
                : 'text-dark'
            }`}
          />
        </span>
      )
    },
    {
      header: 'Rejected Testcase',
      accessorKey: 'total_rejected_testcases',
      size: 230,
      enableSorting: false,
      enableColumnFilter: true,
      Header: (
        <span>
          Rejected Testcase
          <i
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(
                e,
                'total_rejected_testcases',
                'total_rejected_testcases',
                'number'
              )
            }
            className={`icofont-filter ms-2 ${
              isFilterApplied['total_rejected_testcases']
                ? 'text-warning'
                : 'text-dark'
            }`}
          />
        </span>
      )
    },
    {
      header: 'Approved Testcase',
      accessorKey: 'total_approved_testcases',
      size: 235,
      enableSorting: false,
      enableColumnFilter: true,
      Header: (
        <span>
          Approved Testcase
          <i
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(
                e,
                'total_approved_testcases',
                'total_approved_testcases',
                'number'
              )
            }
            className={`icofont-filter ms-2 ${
              isFilterApplied['total_approved_testcases']
                ? 'text-warning'
                : 'text-dark'
            }`}
          />
        </span>
      )
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      size: 180,
      enableSorting: false,
      enableColumnFilter: true,
      Header: (
        <span>
          Created At
          <i
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'created_at', 'created_at', 'text')
            }
            className={`icofont-filter ms-2 ${
              isFilterApplied['created_at'] ? 'text-warning' : 'text-dark'
            }`}
          />
        </span>
      )
    },
    {
      header: 'Created By',
      accessorFn: (row) =>
        row.created_by
          ? `${row.created_by?.first_name} ${row.created_by?.last_name}`
          : '-',
      size: 180,
      enableSorting: false,
      enableColumnFilter: true,
      Header: (
        <span>
          Created By
          <i
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'created_by', 'created_by', 'text')
            }
            className={`icofont-filter ms-2 ${
              isFilterApplied['created_by'] ? 'text-warning' : 'text-dark'
            }`}
          />
        </span>
      )
    },
    {
      header: 'Updated At',
      accessorKey: 'updated_at',
      size: 180,
      enableSorting: false,
      enableColumnFilter: true,
      Header: (
        <span>
          Updated At
          <i
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'updated_at', 'updated_at', 'text')
            }
            className={`icofont-filter ms-2 ${
              isFilterApplied['updated_at'] ? 'text-warning' : 'text-dark'
            }`}
          />
        </span>
      )
    },
    {
      header: 'Updated By',
      accessorFn: (row) =>
        row.updated_by
          ? `${row.updated_by?.first_name} ${row.updated_by?.last_name}`
          : '-',
      size: 185,
      enableSorting: false,
      enableColumnFilter: true,
      Header: (
        <span>
          Updated By
          <i
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              handleFilterClick(e, 'updated_by', 'updated_by', 'text')
            }
            className={`icofont-filter ms-2 ${
              isFilterApplied['updated_by'] ? 'text-warning' : 'text-dark'
            }`}
          />
        </span>
      )
    }
  ];
  const [clearData, setClearData] = useState(false);
  const [sendToReviewerModal, setSendToReviewerModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });
  const [sendTestCaseCount, setSendTestCaseCount] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });
  const handleButtonClick = () => {
    setIsFilterApplied(false);

    setClearData(true);
    setPaginationData({
      pageSize: 10,
      pageIndex: 1
    });

    dispatch(
      getTestCaseReviewListThunk({
        limit: paginationData?.pageSize,
        page: paginationData?.pageIndex,
        filter_testcase_data: [],
        type: 'reviewer'
      })
    );
  };

  const handleSendToReviewerModal = (currentData) => {
    setSendToReviewerModal(currentData);
    dispatch(getEmployeeData());
  };

  const handleTestCaseData = (currentData) => {
    setSendTestCaseCount(currentData);
  };

  const [reviewerError, setReviewerError] = useState([]);
  const [disable, setDisable] = useState(false);
  const handleSubmit = () => {
    if (!reviewerId) {
      setReviewerError('Reviewer Id is Required');
    } else {
      setReviewerError('');
    }
    // const testCasesData =
    //   selectedRows?.length > 0
    //     ? selectedRows?.map((id) => id)
    //     : getDraftTestListData
    //         ?.filter((row) => row.status === 'DRAFT')
    //         ?.map((row) => row.id);

    let formData;

    // if (selectedRows?.length <= 0) {
    //   formData = {
    //     reviewer_id: reviewerId
    //   };
    // } else {
    //   formData = {
    //     testcase_id: testCasesData,
    //     reviewer_id: reviewerId,
    //     status_id: testCasesStatusDataList?.id
    //   };
    // }

    formData = {
      reviewer_id: reviewerId
    };
    setDisable(true);
    dispatch(
      sendTestPlanReviewerThunk({
        formData,
        type: 'DRAFT',
        id: sendToReviewerModal?.modalData?.id,

        onSuccessHandler: () => {
          setSendToReviewerModal({ showModal: false });
          setDisable(false);

          dispatch(
            getTestCaseReviewListThunk({
              limit: paginationData.pageSize,
              page: paginationData.pageIndex + 1,
              type: 'reviewer'
            })
          );
        },
        onErrorHandler: () => {}
      })
    );
  };
  const convertToCSV = (arr) => {
    const array = [Object.keys(arr[0])].concat(
      arr.map((obj) => Object.values(obj))
    );

    return array
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');
  };

  const handleTestData = () => {
    if (!selectedStatus) {
      alert('Please select a status first.');
      return;
    }

    setDisable(true);
    // dispatch(
    //   getReviewTestCasesData({
    //     id: sendTestCaseCount?.modalData?.id,
    //     status: selectedStatus.label,

    //     onSuccessHandler: () => {
    //       setSendTestCaseCount({ showModal: false });
    //       setDisable(false);
    //     }
    //   })
    // );
    dispatch(
      getReviewTestCasesData({
        id: sendTestCaseCount?.modalData?.id,
        status: selectedStatus.label,

        onSuccessHandler: (responseData) => {
          setSendTestCaseCount({ showModal: false });
          setDisable(false);
          setSelectedStatus(null);

          // const testData = responseData?.data;
          const testData = responseData?.data?.map((item) => {
            return {
              tc_id: item.tc_id || '',
              // tester_name: item.tester_name
              //   ? `${item.tester_name?.first_name} ${item.tester_name?.last_name}`
              //   : '',
              project_name: item?.project?.project_name || '',
              module_name: item?.module?.module_name || '',
              sub_module_name: item?.sub_module?.sub_module_name || '',
              platform: item?.platform || '',
              function_name: item?.function_master?.function_name || '',
              field: item?.field || '',
              testing_type: item?.testing_type?.type_name || '',
              testing_group: item?.testing_group || '',
              severity: item?.severity || '',
              test_description: item?.test_description || '',
              status: item?.tai_bc_status_conventions?.convention_name || '',
              steps: item?.steps || '',
              expected_result: item?.expected_result || '',
              reviewer_comment: item?.reviewer_comment?.reviewer_comment || '',
              created_by: `${item?.created_by?.first_name || ''} ${
                item?.created_by?.last_name || ''
              }`,
              created_at: item?.created_at,
              updated_by: `${item?.updated_by?.first_name || ''} ${
                item?.updated_by?.last_name || ''
              }`,
              updated_at: item?.updated_at || '',
              is_automation_script: item?.is_automation_script || ''
            };
          });
          if (Array?.isArray(testData) && testData?.length > 0) {
            // ✅ Convert JSON to CSV string
            const csv = convertToCSV(testData);
            // ✅ Trigger file download
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', responseData.file_name);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            toast.warn('No test case data to download.');
          }
        },

        errorHandler: () => {
          setDisable(false);
          setSelectedStatus(null);
          // onErrorHandler();
          // toast.error('Failed to fetch test case data.');
        }
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
          getTestCaseReviewListThunk({
            limit: paginationData.pageSize,
            page: paginationData.pageIndex + 1,
            filter_testcase_data: updatedFilters,
            type: 'reviewer'
          })
        );
        localDispatch({ type: 'SET_MODAL_IS_OPEN', payload: false });
        localDispatch({ type: 'SET_SEARCH_TERM', payload: '' });
        localDispatch({ type: 'SET_SELECTED_FILTER', payload: [] });
      } catch (error) {}
    }
  }, [sortOrder]);

  useEffect(() => {
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

    const updatedFilters = [...filters, newFilter];
    dispatch(
      getTestCaseReviewListThunk({
        limit: paginationData.pageSize,
        page: paginationData.pageIndex + 1,
        filter_testcase_data:
          updatedFilters?.length === 1 &&
          updatedFilters[0]?.column === filterColumnId
            ? []
            : updatedFilters,
        type: 'reviewer'
      })
    );
  }, [paginationData?.pageIndex, paginationData?.pageSize]);

  useEffect(() => {
    if (filterValues && searchTerm?.length === 0) {
      localDispatch({ type: 'SET_FILTER_VALUES', payload: filterValues });
      if (state.isFilterApplied === false) {
        localDispatch({
          type: 'SET_SELECTED_FILTER',
          payload: filterValues.map((item) => item.name)
        });
      }
      // localDispatch({
      //   type: 'SET_SELECTED_FILTER',
      //   payload: filterValues.map((item) => item.name)
      // });
      localDispatch({
        type: 'SET_SELECTED_FILTER_IDS',
        payload: filterValues.map((item) => item.id)
      });
    }
  }, [filterValues, localDispatch]);
  useEffect(() => {
    // Whenever searchTerm or filterData changes, update the selected filter IDs
    // if (searchTerm?.length === 0) {
    // const filteredData = filteredResults?.filter((item) =>
    //   item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    // );
    const filteredData = filteredResults?.filter((item) =>
      (item?.name || '')
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    const filteredIds = filteredData?.map((item) => item.id);
    localDispatch({ type: 'SET_SELECTED_FILTER_IDS', payload: filteredIds });
    // }
  }, [searchTerm, localDispatch]);
  return (
    <>
      <Box ml={1}>
        <PageHeader
          showBackBtn
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
      </Box>
      <Container fluid className="mt-3">
        {testCaseReviewList && (
          <MaterialTable
            columns={columns}
            totalRows={totalCount}
            paginationData={paginationData}
            setPaginationData={setPaginationData}
            data={testCaseReviewList}
            enableRowNumbers={true}
            isLoading={isLoading?.testCaseReviewList}
            isExportData={false}
            manualPagination={true}
            muiPaginationProps={{
              rowsPerPageOptions: [10, 30, 50, 100, 200, 500, 1000, 2000]
            }}
          />
        )}
        {/* <DataTable
          columns={columns}
          data={testCaseReviewList}
          persistTableHead={true}
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
        /> */}
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
          setSelectedValue={setSelectedValue}
          selectedValue={selectedValue}
          isFilterApplied={state.isFilterApplied}
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
          {/* {filterTestData?.length > 0 && ( */}
          <Select
            type="text"
            id="reviewer_id"
            name="reviewer_id"
            options={filterTestData?.filter(
              (d) => d?.value != sendToReviewerModal?.modalData?.tester_id
            )}
            required
            onChange={(e) => {
              const selectedId = e?.value;
              localDispatch({ type: 'SET_REVIEWER_ID', payload: selectedId });
              // setReviewerError('');
            }}
            placeholder="select..."
          />
          {/* )} */}
          {/* {reviewerError && (
            <p
              style={{
                color: 'red'
              }}
            >
              {reviewerError}
            </p>
          )} */}
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
            className="btn btn-danger text-white"
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

      <Modal
        centered
        show={sendTestCaseCount.showModal}
        size="sm"
        onHide={(e) => {
          handleTestCaseData({
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
              Select Status : <Astrick color="red" size="13px" />
            </b>
          </label>
          {/* {filterTestData?.length > 0 && ( */}
          <Select
            type="text"
            id="status"
            name="status"
            options={options}
            onChange={handleStatusChange}
            value={selectedStatus}
            required
            placeholder="select..."
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            type="submit"
            className="btn btn-sm btn bg-success text-white"
            onClick={() => handleTestData()}
            disabled={disable}
          >
            <i class="icofont-paper-plane "></i> {''}
            Submit
          </button>

          <button
            type="button"
            className="btn btn-danger text-white"
            onClick={() => {
              handleTestCaseData({
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
    </>
  );
}

export default TestCaseReviewComponent;
