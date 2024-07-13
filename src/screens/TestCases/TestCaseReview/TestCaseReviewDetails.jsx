import React, { useEffect, useReducer, useState } from 'react';
import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportDataFile';
import { _base } from '../../../settings/constants';
import {
  approveRejectByReviewerMasterThunk,
  getByTestPlanIDListThunk,
  getExportByTestPlanIDListThunk
} from '../../../redux/services/testCases/testCaseReview';
import { getReviewCommentMasterListThunk } from '../../../redux/services/testCases/reviewCommentMaster';
import EditTestCaseModal from '../TestDraft/EditTestCaseModal';
import CustomFilterModal from '../Modal/CustomFilterModal';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';

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

function TestCaseReviewDetails() {
  const { id } = useParams();
  const planID = id;
  const dispatch = useDispatch();

  const {
    testPlanIdData,
    allTestPlanIDData,
    filterTestPlanData,
    exportTestCaseReviewData,
    isLoading
  } = useSelector((state) => state?.testCaseReview);
  const { getFilterReviewCommentMasterList } = useSelector(
    (state) => state?.reviewCommentMaster
  );
  const [paginationData, setPaginationData] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    { rowPerPage: 10, currentPage: 1, currentFilterData: {} }
  );

  const [addEditTestCasesModal, setAddEditTestCasesModal] = useState({
    type: '',
    data: '',
    open: false
  });

  const [errorMessage, setErrorMessage] = useState('');

  const [state, localDispatch] = useReducer(localReducer, initialState);
  const [rowData, setRowData] = useState([]);
  const [commonComment, setCommonComment] = useState('');
  const [commonRemark, setCommonRemark] = useState('');
  const [comments, setComments] = useState({});
  const [remarks, setRemarks] = useState({});
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [checkCommonComment, setCheckCommonComment] = useState([]);
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
    selectAllNames,
    selectedRows,
    betweenValues
  } = state;

  const generateOptions = (options) => {
    return [
      <option key={options.value} value="" disabled>
        Select Reviewer comment
      </option>,
      ...options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))
    ];
  };

  const handleRowChange = (id, field, value) => {
    setCommentIdError('');
    if (field === 'comment_id') {
      setComments((prev) => ({ ...prev, [id]: value }));
    } else if (field === 'other_remark') {
      setRemarks((prev) => ({ ...prev, [id]: value }));
    }
    setRowData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
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

  const [commentIdError, setCommentIdError] = useState('');
  const handleSubmit = async (status) => {
    const updatedRows = exportTestCaseReviewData
      ?.filter((row) => selectedRows?.includes(row.tc_id))
      ?.map((row) => ({
        tc_id: row.tc_id,

        comment_id: comments[row.id] || row.comment_id || commonComment,
        other_remark: remarks[row.id] || row.other_remark
      }));

    const newCommentIdErrors = [];

    updatedRows?.forEach((row) => {
      if (!row?.comment_id) {
        newCommentIdErrors[row.tc_id] = 'Reviewer comment is required';
      }
    });

    if (newCommentIdErrors?.length > 0 && !commonComment) {
      setCommentIdError(newCommentIdErrors);
    } else {
      setCommentIdError('');

      const formData = {
        review_testcase_data: updatedRows,
        status: status,
        common_comment_id: commonComment,
        common_remark: commonRemark
      };

      dispatch(
        approveRejectByReviewerMasterThunk({
          planID,
          formData,
          onSuccessHandler: () => {
            // setCommonComment('');
            setCommonRemark('');
            dispatch(
              getByTestPlanIDListThunk({
                id: id,
                limit: paginationData.rowPerPage,
                page: paginationData.currentPage
              })
            );
            localDispatch({ type: 'SET_SELECT_ALL_NAMES', payload: false });
            localDispatch({ type: 'SET_SELECTED_ROWS', payload: [] });
            setRowData(testPlanIdData);
          },
          onErrorHandler: () => {}
        })
      );
    }
  };

  const handleSelectAllNamesChange = () => {
    const newSelectAllNames = !selectAllNames;
    localDispatch({ type: 'SET_SELECT_ALL_NAMES', payload: newSelectAllNames });

    if (newSelectAllNames) {
      const draftRowIds = exportTestCaseReviewData.map((row) => row.tc_id);
      localDispatch({ type: 'SET_SELECTED_ROWS', payload: draftRowIds });
    } else {
      localDispatch({ type: 'SET_SELECTED_ROWS', payload: [] });
    }
  };

  useEffect(() => {
    // if (testPlanIdData) {
    //   setRowData(testPlanIdData);
    // }
    setRowData(testPlanIdData);
  }, [testPlanIdData]);

  const columns = [
    {
      name: 'Action',
      selector: (row) => (
        <div className="d-flex align-items-center">
          <i
            className="icofont-edit text-primary  btn btn-outline-secondary cp me-3"
            onClick={() =>
              setAddEditTestCasesModal({
                type: 'EDIT',
                data: row,
                open: true
              })
            }
          />

          <Link to={`/${_base + '/TestCaseHistoryComponent/' + row?.id}`}>
            <i class="icofont-history cp   btn btn-outline-secondary fw-bold" />
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
            checked={selectedRows?.includes(row.tc_id)}
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
            className={`icofont-filter ms-2 ${
              isFilterApplied['module_name'] ? 'text-success' : 'text-dark'
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
            className={`icofont-filter ms-2 ${
              isFilterApplied['sub_module_name'] ? 'text-success' : 'text-dark'
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
          <span>Function</span>
          <i
            onClick={(e) =>
              handleFilterClick(e, 'function_name', 'Function', 'text')
            }
            className={`icofont-filter ms-2 ${
              isFilterApplied['function_name'] ? 'text-success' : 'text-dark'
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
              isFilterApplied['field'] ? 'text-success' : 'text-dark'
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
              isFilterApplied['type_name'] ? 'text-success' : 'text-dark'
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
            className={`icofont-filter ms-2 ${
              isFilterApplied['group_name'] ? 'text-success' : 'text-dark'
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
          <span>Test Id</span>
          <i
            onClick={(e) => handleFilterClick(e, 'tc_id', 'Test Id', 'number')}
            className={`icofont-filter ms-2 ${
              isFilterApplied['tc_id'] ? 'text-success' : 'text-dark'
            }`}
          />
        </div>
      ),
      selector: (row) => row.tc_id,
      width: '10rem',
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
          <span>Severity</span>
          <i
            onClick={(e) => handleFilterClick(e, 'id', 'Severity', 'text')}
            className={`icofont-filter ms-2 ${
              isFilterApplied['Severity'] ? 'text-success' : 'text-dark'
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
            className={`icofont-filter ms-2 ${
              isFilterApplied['test_description'] ? 'text-success' : 'text-dark'
            }`}
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
            className={`icofont-filter ms-2 ${
              isFilterApplied['expected_result'] ? 'text-success' : 'text-dark'
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
            className={`icofont-filter ms-2 ${
              isFilterApplied['steps'] ? 'text-success' : 'text-dark'
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
            className={`icofont-filter ms-2 ${
              isFilterApplied['status'] ? 'text-success' : 'text-dark'
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
        <div>
          <select
            className="form-select"
            aria-label="Default select example"
            // value={row.comment_id || ''}
            // value={comments[row.id] || row.comment_id || ''}
            // value={
            //   selectedRows && selectedRows.includes(row.tc_id)
            //     ? comments[row.id] || commonComment
            //     : commonComment
            // }
            value={comments[row.id] || row.comment_id || commonComment || ''}
            id="comment_id"
            name="comment_id"
            onChange={(e) =>
              handleRowChange(row.id, 'comment_id', e.target.value)
            }
          >
            {generateOptions(getFilterReviewCommentMasterList)}
          </select>

          {commentIdError[row.tc_id] &&
            selectedRows &&
            selectedRows.includes(row.tc_id) && (
              <div className="col">
                <span className="text-danger">{commentIdError[row.tc_id]}</span>
              </div>
            )}
        </div>
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
          maxLength={100}
          // value={
          //   selectedRows && selectedRows.includes(row.id)
          //     ? remarks[row.id] || row.other_remark
          //     : commonRemark
          // }
          onChange={(e) =>
            handleRowChange(row.id, 'other_remark', e.target.value)
          }
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
            className={`icofont-filter ms-2 ${
              isFilterApplied['project_name'] ? 'text-success' : 'text-dark'
            }`}
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
            className={`icofont-filter ms-2 ${
              isFilterApplied['created_at'] ? 'text-success' : 'text-dark'
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
            className={`icofont-filter ms-2 ${
              isFilterApplied['created_by'] ? 'text-success' : 'text-dark'
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
    },

    {
      name: (
        <div>
          <span>Updated At</span>
          <i
            onClick={(e) =>
              handleFilterClick(e, 'updated_at', 'updated_at', 'text')
            }
            className={`icofont-filter ms-2 ${
              isFilterApplied['updated_at'] ? 'text-success' : 'text-dark'
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
          {row.updated_at && (
            <OverlayTrigger overlay={<Tooltip>{row.updated_at} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.updated_at && row.updated_at.length < 20
                    ? row.updated_at
                    : row.updated_at.substring(0, 50) + '....'}
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
            onClick={(e) =>
              handleFilterClick(e, 'updated_by', 'updated_by', 'text')
            }
            className={`icofont-filter ms-2 ${
              isFilterApplied['updated_by'] ? 'text-success' : 'text-dark'
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
          {row.updated_by && (
            <OverlayTrigger overlay={<Tooltip>{row.updated_by} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.updated_by && row.updated_by.length < 20
                    ? row.updated_by
                    : row.updated_by.substring(0, 50) + '....'}
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
    created_by: 'created_by',
    updated_at: 'updated_at',
    updated_by: 'updated_by'
  };

  const transformDataForExport = (rowData, data, comments, commonComment) => {
    console.log('rowData', rowData);
    console.log('comments', comments);
    console.log('commonComment', commonComment);

    if (comments || commonComment) {
      const obj = comments;
      let objKey;
      let val;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          objKey = key;
          val = obj[key];
        }
      }

      const filteredCommnet = getFilterReviewCommentMasterList.filter(
        (comment) => {
          if (Object.keys(obj).length > 0) {
            console.log('comment true');
            checkCommonComment.push(comment.value);
            return comment.value == val;
          } else {
            console.log('comment false');
            return comment.value == commonComment;
          }
        }
      );

      // const filteredCommonCommnet = getFilterReviewCommentMasterList.filter(
      //   (comment) =>
      // );
      //
      console.log('filteredCommonCommnet', filteredCommnet);
      return;
      for (let i = 0; i < rowData.length; i++) {
        if (rowData[i].id == objKey) {
          rowData[i].reviewer_comment = filteredCommnet[0].label;
        }
        //  else {
        //   rowData[i].reviewer_comment = filteredCommonCommnet[0]?.label;
        // }
      }
    }

    // const updateReviewerComment = rowData.map((rowData) => {
    //   if (rowData.id === key) {
    //     rowData.reviewer_comment = filteredCommnet[0].value;
    //   }
    // });

    return rowData.map((rowData) => ({
      module_name: rowData.module_name,
      sub_module_name: rowData.sub_module_name,
      function_name: rowData.function_name,
      field: rowData.field,
      type_name: rowData.type_name,
      group_name: rowData.group_name,
      tc_id: rowData.tc_id,
      test_description: rowData.test_description,
      steps: rowData.steps,
      severity: rowData.severity,
      expected_result: rowData.expected_result,
      rev: rowData.rev,
      // reviewer_comment:
      //   comments[row.id] || row.comment_id || commonComment || '',
      reviewer_comment: rowData.reviewer_comment,
      remark: remarks[rowData.id] || rowData.other_remark || commonRemark,

      project_name: rowData.project_name,
      created_at: rowData.created_at,
      created_by: rowData.created_by,
      updated_at: rowData.updated_at,
      updated_by: rowData.updated_by
    }));
  };

  // Example usage
  const transformedData = transformDataForExport(
    rowData,
    exportTestCaseReviewData,
    comments,
    commonComment
  );

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
    { title: 'Status', field: 'rev' },
    { title: 'Reviewer Comment', field: 'reviewer_comment' },
    { title: 'Remark', field: 'remark' },
    { title: 'Project', field: 'project_name' },
    { title: 'Created At', field: 'created_at' },
    { title: 'Created By', field: 'created_by' },
    { title: 'Updated At', field: 'updated_at' },
    { title: 'Updated By', field: 'updated_by' }
  ];

  const handleFilterClick = (event, column, name, type, id) => {
    if (clearData === true) {
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
      severity: 'severities',
      group_name: 'group_names',
      test_description: 'test_descriptions',

      steps: 'steps',
      expected_result: 'expected_results',
      status: 'status',
      project_name: 'project_names',
      created_at: 'created_at',
      created_by: 'created_by',
      updated_at: 'updated_at',
      updated_by: 'updated_by'
    };
    const filteredData = filterTestPlanData[filterKeyMap[column]];
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
    item?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
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
        getByTestPlanIDListThunk({
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
        getByTestPlanIDListThunk({
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
        getByTestPlanIDListThunk({
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

  const [clearData, setClearData] = useState(false);

  const handleButtonClick = () => {
    setIsFilterApplied(false);
    setClearData(true);
    setPaginationData({
      rowPerPage: 10,
      currentPage: 1
    });
    dispatch(
      getByTestPlanIDListThunk({
        id: id,
        limit: paginationData.rowPerPage,
        page: 1,
        filter_testcase_data: []
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
          getByTestPlanIDListThunk({
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
      getByTestPlanIDListThunk({
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
    dispatch(
      getExportByTestPlanIDListThunk({
        id: id,
        type: 'ALL'
      })
    );
    dispatch(getReviewCommentMasterListThunk());
  }, [paginationData.rowPerPage, paginationData.currentPage]);
  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Test Case Review"
        renderRight={() => {
          return (
            <div className="col-md-6 d-flex justify-content-end">
              <button
                onClick={handleButtonClick}
                className="btn btn-primary text-white me-2"
                disabled={
                  !rowData ||
                  rowData?.length <= 0 ||
                  filterTestPlanData?.payload === 'null'
                }
              >
                Clear All Filter
              </button>
              <ExportToExcel
                className="btn btn-sm btn-danger "
                fileName="Test Case Review List"
                apiData={transformedData}
                columns={exportColumns}
              />
            </div>
          );
        }}
      />
      <Container fluid className="employee_joining_details_container">
        <h5 className="mb-0 text-primary">Test Cases</h5>
        <hr className="primary_divider " />
        <DataTable
          columns={columns}
          data={rowData}
          defaultSortField="role_id"
          pagination
          paginationServer
          paginationTotalRows={allTestPlanIDData?.data?.total}
          paginationDefaultPage={rowData?.currentPage}
          onChangePage={(page) => setPaginationData({ currentPage: page })}
          onChangeRowsPerPage={(newPageSize) => {
            setPaginationData({ rowPerPage: newPageSize });
            setPaginationData({ currentPage: 1 });
          }}
          progressPending={isLoading?.testPlanIdData}
          progressComponent={<TableLoadingSkelton />}
          paginationRowsPerPageOptions={[10, 15, 20, 25, 30]}
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
        />
      </Container>

      <div className="row mt-4">
        <div className="col-md-3">
          <label className="form-label font-weight-bold">
            Reviewer Comment :
          </label>

          <select
            className="form-select"
            value={commonComment}
            id="common_comment_id"
            name="common_comment_id"
            onChange={(e) => {
              setCommonComment(e.target.value);
              setCommentIdError('');
            }}
          >
            {generateOptions(getFilterReviewCommentMasterList)}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label font-weight-bold">Remark :</label>
          <input
            className="form-control"
            id="common_remark"
            name="common_remark"
            value={commonRemark}
            onChange={(e) => setCommonRemark(e.target.value)}
          />
        </div>
      </div>

      <div className=" d-flex col-12 justify-content-end mt-2">
        <button
          type="submit"
          onClick={() => handleSubmit('RESEND')}
          className="btn btn-sm btn-warning text-white"
          disabled={!rowData || rowData?.length <= 0}
        >
          <i class="icofont-paper-plane icon-large mx-2"></i>
          Send For Modification
        </button>
        <button
          onClick={() => handleSubmit('REJECTED')}
          type="submit"
          disabled={!rowData || rowData?.length <= 0}
          className="btn btn-lg btn-danger text-white "
        >
          Reject
        </button>

        <button
          type="submit"
          className="btn btn-lg  btn-success  text-white "
          onClick={() => handleSubmit('APPROVED')}
          disabled={!rowData || rowData?.length <= 0}
        >
          Approve
        </button>
      </div>
      {addEditTestCasesModal.open === true && (
        <EditTestCaseModal
          show={addEditTestCasesModal?.open}
          type={addEditTestCasesModal?.type}
          currentTestCasesData={addEditTestCasesModal?.data}
          close={(prev) => setAddEditTestCasesModal({ ...prev, open: false })}
          paginationData={paginationData}
          id={planID}
          payloadType={'TestCaseReview'}
        />
      )}
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

export default TestCaseReviewDetails;
