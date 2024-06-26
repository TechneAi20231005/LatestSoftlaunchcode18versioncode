import React, { useEffect, useState } from 'react';
import { Col, Container, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import PageHeader from '../../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../../components/Utilities/Table/ExportToExcel';
import AddEditSalaryModal from './AddEditSalaryModal';
import StatusBadge from '../../../../components/custom/Badges/StatusBadge';
import { getSalaryMasterListThunk } from '../../../../redux/services/hrms/employeeJoining/salaryMaster';
import TableLoadingSkelton from '../../../../components/custom/loader/TableLoadingSkelton';
import {
  customSearchHandler,
  formatNumberWithCurrency
} from '../../../../utils/customFunction';

function SalaryMaster() {
  // // initial state
  const dispatch = useDispatch();

  // // redux state
  const { salaryMasterList, isLoading } = useSelector(
    (state) => state?.salaryMaster
  );

  // // local state
  const [searchValue, setSearchValue] = useState('');
  const [addEditSalaryModal, setAddEditSalaryModal] = useState({
    type: '',
    data: '',
    open: false
  });
  const [filteredSalaryMasterList, setFilteredSalaryMasterList] = useState([]);

  // // static data
  const columns = [
    {
      name: 'Action',
      selector: (row) => (
        <i
          className="icofont-edit text-primary cp"
          onClick={() =>
            setAddEditSalaryModal({ type: 'EDIT', data: row, open: true })
          }
        />
      ),
      sortable: false,
      width: '70px'
    },
    {
      name: 'Sr. No.',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '70px'
    },
    {
      name: 'Department',
      selector: (row) =>
        row?.department ? (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-${row.id}`}>{row?.department}</Tooltip>
            }
          >
            <span>{row?.department || '--'}</span>
          </OverlayTrigger>
        ) : (
          '--'
        ),
      sortable: true,
      width: '200px'
    },
    {
      name: 'Designation',
      selector: (row) =>
        row?.designation ? (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-${row.id}`}>{row?.designation}</Tooltip>
            }
          >
            <span>{row?.designation || '--'}</span>
          </OverlayTrigger>
        ) : (
          '--'
        ),
      sortable: true,
      width: '200px'
    },
    {
      name: 'Location',
      selector: (row) =>
        row?.locations?.length ? (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-${row.id}`}>
                {row?.locations?.map((location) =>
                  location?.location_name
                    ? `${location?.location_name}, `
                    : '--'
                )}
              </Tooltip>
            }
          >
            <span>
              {row?.locations?.map((location) =>
                location?.location_name ? `${location?.location_name}, ` : '--'
              )}
            </span>
          </OverlayTrigger>
        ) : (
          '--'
        ),
      sortable: true,
      width: '300px'
    },
    {
      name: 'Experience Level',
      selector: (row) => row?.experience_level || '--',
      sortable: true,
      width: '150px'
    },
    {
      name: 'Salary (Net)',
      selector: (row) =>
        row?.max_salary ? formatNumberWithCurrency(row?.max_salary) : '--',
      sortable: true,
      width: '175px'
    },

    {
      name: 'Remark',
      sortable: true,
      // selector: row => row?.remark || '--',
      selector: (row) =>
        row?.remark ? (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-${row.id}`}>{row?.remark}</Tooltip>}
          >
            <span>{row?.remark || '--'}</span>
          </OverlayTrigger>
        ) : (
          '--'
        ),
      width: '300px'
    },
    {
      name: 'Status',
      selector: (row) => <StatusBadge status={row?.is_active} />,
      sortable: true,
      width: '120px'
    },
    {
      name: 'Created At',
      selector: (row) => row?.created_at || '--',
      sortable: true,
      width: '175px'
    },
    {
      name: 'Created By',
      selector: (row) => row?.created_by || '--',
      sortable: true,
      width: '175px'
    },

    {
      name: 'Updated At',
      selector: (row) => row?.updated_at || '--',
      sortable: true,
      width: '175px'
    },
    {
      name: 'Updated By',
      selector: (row) => row?.updated_by || '--',
      sortable: true,
      width: '175px'
    }
  ];

  // Function to handle search button click
  const handleSearch = () => {
    const filteredList = customSearchHandler(salaryMasterList, searchValue);
    setFilteredSalaryMasterList(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchValue('');
    setFilteredSalaryMasterList(salaryMasterList);
  };

  const transformDataForExport = (data) => {
    return data?.map((row, index) => ({
      'Sr No.': index + 1,
      Department: row?.department || '--',
      Designation: row?.designation || '--',
      Location: row?.locations
        ?.map((location) => location?.location_name || '--')
        .join(', '),
      'Experience Level': row?.experience_level || '--',
      'Salary (Net)': row?.max_salary || '--',
      Remark: row?.remark || '--',
      Status: row?.is_active ? 'Active' : 'Deactive',
      'Created At': row?.created_at || '--',
      'Created By': row?.created_by || '--',
      'Updated At': row?.updated_at || '--',
      'Updated By': row?.updated_by || '--'
    }));
  };

  // // life cycle
  useEffect(() => {
    dispatch(getSalaryMasterListThunk());
  }, []);

  // Update the useEffect to update the filtered list when salaryMasterList changes
  useEffect(() => {
    setFilteredSalaryMasterList(salaryMasterList);
  }, [salaryMasterList]);

  // Function to handle search onchange
  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  return (
    <>
      <Container fluid>
        <PageHeader
          headerTitle="Salary Master"
          renderRight={() => {
            return (
              <button
                className="btn btn-dark px-5"
                onClick={() =>
                  setAddEditSalaryModal({ type: 'ADD', data: '', open: true })
                }
              >
                <i className="icofont-plus me-2 fs-6" />
                Add Salary
              </button>
            );
          }}
        />
        <Row className="row_gap_3">
          <Col xs={12} md={7} xxl={8}>
            <input
              type="search"
              name="interview_search"
              value={searchValue}
              onChange={(e) => setSearchValue(e?.target?.value)}
              placeholder="Search..."
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
              apiData={transformDataForExport(filteredSalaryMasterList)}
              fileName="Salary Lists Records"
              disabled={!filteredSalaryMasterList?.length}
            />
          </Col>
        </Row>
        <DataTable
          columns={columns}
          data={filteredSalaryMasterList}
          defaultSortField="role_id"
          pagination
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
          progressPending={isLoading?.getSalaryMasterList}
          progressComponent={<TableLoadingSkelton />}
        />
      </Container>

      <AddEditSalaryModal
        show={addEditSalaryModal?.open}
        type={addEditSalaryModal?.type}
        currentSalaryData={addEditSalaryModal?.data}
        close={(prev) => setAddEditSalaryModal({ ...prev, open: false })}
      />
    </>
  );
}

export default SalaryMaster;
