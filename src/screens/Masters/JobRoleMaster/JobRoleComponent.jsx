import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import PageHeader from '../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportDataFile';
import DataTable from 'react-data-table-component';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import { useDispatch, useSelector } from 'react-redux';
import { customSearchHandler } from '../../../utils/customFunction';
import AddEditJobRoleMaster from './AddEditjobRoleMaster';
import { getJobRoleMasterListThunk } from '../../../redux/services/jobRoleMaster';

function JobRoleMasterComponent() {
  const dispatch = useDispatch();
  const { jobRoleMasterList, isLoading } = useSelector(
    (state) => state?.jobRoleMaster
  );
  const [searchValue, setSearchValue] = useState('');
  const [filterJobRoleMasterList, setFilterJobRoleMasterList] = useState([]);
  const [addEditJobRoleModal, setAddEditJobRoleModal] = useState({
    type: '',
    data: '',
    open: false
  });
  const handleSearch = () => {
    const filterList = customSearchHandler(jobRoleMasterList, searchValue);
    setFilterJobRoleMasterList(filterList);
  };
  const handleReset = () => {
    setSearchValue('');
    setFilterJobRoleMasterList(jobRoleMasterList);
  };

  const columns = [
    {
      name: 'action',
      selector: (row) => (
        <i
          className="icofont-edit text-primary cp"
          onClick={() =>
            setAddEditJobRoleModal({
              type: 'EDIT',
              data: row,
              open: true
            })
          }
        />
      ),
      sortable: false,
      width: '70px'
    },

    {
      name: 'Sr.No.',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '70px'
    },

    {
      name: 'Job Role Title',
      selector: (row) => row.job_role,
      sortable: false,
      width: '200px'
    },
    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_active == 1 && (
            <span className="badge bg-primary" style={{ width: '4rem' }}>
              Active
            </span>
          )}
          {row.is_active == 0 && (
            <span className="badge bg-danger" style={{ width: '4rem' }}>
              Deactive
            </span>
          )}
        </div>
      ),
      width: '100px'
    },
    {
      name: 'Created At',
      selector: (row) => row.created_at || '--',
      sortable: false,
      width: '175px'
    },
    {
      name: 'Created By',
      selector: (row) => row.created_by || '--',
      sortable: false,
      width: '175px'
    },
    {
      name: 'Updated At',
      selector: (row) => row.updated_at || '--',
      sortable: false,
      width: '175px'
    },
    {
      name: 'Updated By',
      selector: (row) => row.updated_by || '--',
      sortable: false,
      width: '175px'
    }
  ];
  const transformDataForExport = (data) => {
    return data.map((row) => ({
      jobRole: row.job_role || '--',
      status: row.is_active == 1 ? 'Active' : 'Deactive',
      createdAt: row.created_at || '--',
      createdBy: row.created_by || '--',
      updatedAt: row.updated_at || '--',
      updatedBy: row.updated_by || '--'
    }));
  };

  const transformedData = transformDataForExport(filterJobRoleMasterList);
  const exportColumns = [
    { title: 'Job Role Title', field: 'jobRole' },
    { title: 'Status', field: 'status' },
    { title: 'created_At', field: 'createdAt' },
    { title: 'created_By', field: 'createdBy' },
    { title: 'updated_At', field: 'updatedAt' },
    { title: 'updated_By', field: 'updatedBy' }
  ];

  useEffect(() => {
    dispatch(getJobRoleMasterListThunk());
  }, []);

  useEffect(() => {
    setFilterJobRoleMasterList(jobRoleMasterList);
  }, [jobRoleMasterList]);

  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  return (
    <div className="container-xxl">
      <div className="d-flex justify-content-between">
        <PageHeader headerTitle="Job Role Master" />
        <div>
          <button
            className="btn btn-primary text-white"
            onClick={() => {
              setAddEditJobRoleModal({
                type: 'ADD',
                data: '',
                open: true
              });
            }}
          >
            <i className="icofont-plus px-2"></i>
            Add Job Role
          </button>
        </div>
      </div>

      <Row className="row_gap_3">
        <Col xs={12} md={7} xxl={8}>
          <input
            type="search"
            name="job_role_search"
            value={searchValue}
            onChange={(e) => setSearchValue(e?.target?.value)}
            placeholder="Search job role here..."
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
            <i className="icofont-search-1" />
            Search
          </button>
          <button
            className="btn btn-info text-white"
            type="button"
            onClick={handleReset}
          >
            <i className="ico-font-refresh text-white" />
            Reset
          </button>
          <ExportToExcel
            className="btn btn-danger"
            apiData={transformedData}
            columns={exportColumns}
            fileName="Job Role Master Records"
            disabled={!filterJobRoleMasterList?.length}
          />
        </Col>
      </Row>
      <DataTable
        columns={columns}
        data={filterJobRoleMasterList}
        defaultSortField="role_id"
        pagination
        selectableRows={false}
        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
        highlightOnHover={true}
        progressPending={isLoading?.getJobRoleMasterList}
        progressComponent={<TableLoadingSkelton />}
      />
      <AddEditJobRoleMaster
        show={addEditJobRoleModal?.open}
        type={addEditJobRoleModal?.type}
        currentJobRoleData={addEditJobRoleModal?.data}
        close={(prev) => setAddEditJobRoleModal({ ...prev, open: false })}
      />
    </div>
  );
}

export default JobRoleMasterComponent;
