import React, { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import { Astrick } from '../../../components/Utilities/Style';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { getEmployeeData } from '../../Dashboard/DashboardAction';
import {
  getDraftTestCaseList,
  sendTestCaseReviewerThunk
} from '../../../redux/services/testCases/downloadFormatFile';
import EditTestCaseModal from './EditTestCaseModal';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import CustomFilterModal from '../Modal/CustomFilterModal';
import { _base } from '../../../settings/constants';
function TestDraftDetails(props) {
  // // initial state
  const dispatch = useDispatch();

  const { getDraftTestListData, allDraftListData, isLoading } = useSelector(
    (state) => state?.downloadFormat
  );

  const testerData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.getAllTesterDataList
  );

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
  const [selectAllNames, setSelectAllNames] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [reviewerId, setReviewerID] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
  const [type, setType] = useState();

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
    project_name: 'project_id'
  };
  // Check if all rows are selected

  const handleSelectAllNamesChange = () => {
    const newSelectAllNames = !selectAllNames;
    setSelectAllNames(newSelectAllNames);
    if (newSelectAllNames) {
      const draftRowIds = getDraftTestListData
        .filter((row) => row.status === 'DRAFT')
        .map((row) => row.id);
      setSelectedRows(draftRowIds);
    } else {
      setSelectedRows([]);
    }
  };

  // Handles individual checkbox change
  const handleCheckboxChange = (row) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(row.id)) {
        return prevSelectedRows.filter((selectedRow) => selectedRow !== row.id);
      } else {
        return [...prevSelectedRows, row.id];
      }
    });
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

  const filteredUniqueValues =
    filterColumn &&
    getDraftTestListData
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
      setSelectedFilters((prev) => [...prev, label]); // Add the label to selectedFilters
      setSelectedFilterIds((prev) => [...prev, value]); // Add the corresponding value to selectedFilterIds
    } else {
      setSelectedFilters((prev) => prev.filter((filter) => filter !== label)); // Remove the label from selectedFilters
      setSelectedFilterIds((prev) =>
        prev.filter((filterId) => filterId !== value)
      ); // Remove the corresponding value from selectedFilterIds
    }
  };

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
    const newValues = [...betweenValues];
    newValues[index] = value;
    setBetweenValues(newValues);
  };

  const getFilteredValues = () => {
    if (type === 'number') {
      return [Number(betweenValues[0])];
    } else if (filterType === 'is not between' || filterType === 'is between') {
      return betweenValues.map((value) => Number(value));
    }
    return filterText;
  };

  const handleApplyFilter = async () => {
    const newFilter =
      filterColumn === 'id'
        ? {
            column: filterColumnId,
            column_name: filterColumn,
            filter: filterType,
            whereIn: getFilteredValues(),
            sort: sortOrder
          }
        : {
            column: filterColumnId,
            searchText: filterText,
            column_name: filterColumn,
            filter: filterType,
            sort: sortOrder
          };

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
      name: 'Action',
      selector: (row) => (
        <>
          <i
            disabled={row.status !== 'DRAFT'}
            className={`icofont-edit text-primary cp me-3 ${
              row.status !== 'DRAFT' ? 'disabled-icon' : ''
            }`}
            onClick={() =>
              setAddEditTestCasesModal({
                type: 'EDIT',
                data: row,
                open: true,
                id: row.id
              })
            }
          />
          <Link to={`/${_base + '/TestCaseHistoryComponent/' + row?.id}`}>
            <i class="icofont-history cp bg-warning rounded-circle" />
          </Link>
        </>
      ),
      sortable: false,
      width: '90px'
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
            checked={selectedRows.includes(row.id)}
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
            onClick={(e) =>
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
            onClick={(e) =>
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
          <span>Platform</span>
          <i
            onClick={(e) =>
              handleFilterClick(e, 'platform', 'Platform', 'text')
            }
            className="icofont-filter ms-2"
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
      sortable: true,
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
      sortable: true,
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
            className="icofont-filter ms-2"
          />
        </div>
      ),
      selector: (row) => row.steps,
      width: '7rem',
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
      width: '7rem',
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
      name: 'Created At',
      selector: (row) => row.created_at,
      width: '7rem',
      sortable: true,
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
      )
    },

    {
      name: 'Created By',
      selector: (row) => row.created_by,
      width: '7rem',
      sortable: true,
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
      )
    },

    {
      name: 'Updated At',
      selector: (row) => row.updated_at,
      width: '7rem',
      sortable: true,
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
      )
    },

    {
      name: 'Updated By',
      selector: (row) => row.updated_by,
      width: '7rem',
      sortable: true,
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
      )
    }
  ];

  const handleSendToReviewerModal = (currentData) => {
    setSendToReviewerModal(currentData);
    dispatch(getEmployeeData());
  };

  const handleSubmit = () => {
    const testCasesData =
      selectedRows.length > 0
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

    dispatch(
      sendTestCaseReviewerThunk({
        formData,
        type: 'DRAFT',
        id: null,
        onSuccessHandler: () => {
          setSendToReviewerModal({ showModal: false });
          setSelectedRows([]);
          setSelectAllNames(false);
          dispatch(
            getDraftTestCaseList({
              limit: paginationData.rowPerPage,
              page: paginationData.currentPage,
              filter_testcase_data: [
                {
                  column: filterColumnId,
                  searchText: filterText,
                  filter: filterType
                }
              ]
            })
          );
        },
        onErrorHandler: () => {
          // setOpenConfirmModal({ open: false });
        }
      })
    );
  };

  useEffect(() => {
    if (sortOrder && sortOrder != null) {
      handleApplyFilter(sortOrder);
    }
  }, [sortOrder]);
  useEffect(() => {
    dispatch(
      getDraftTestCaseList({
        limit: paginationData.rowPerPage,
        page: paginationData.currentPage
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
          paginationTotalRows={allDraftListData?.total}
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
          disabled={getDraftTestListData?.length <= 0}
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
            onChange={(e) => {
              const selectedId = e?.value;
              setReviewerID(selectedId);
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
        />
      )}
    </>
  );
}

export default TestDraftDetails;
