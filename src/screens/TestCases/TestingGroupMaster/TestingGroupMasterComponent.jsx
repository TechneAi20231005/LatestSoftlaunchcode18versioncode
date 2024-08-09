import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import PageHeader from '../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportDataFile';
import { useDispatch, useSelector } from 'react-redux';
import { customSearchHandler } from '../../../utils/customFunction';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import { getTestingGroupMasterListThunk } from '../../../redux/services/testCases/testingGroupMaster';
import AddTestingGroupModal from './AddTestingGroupModal';
import { Col, Row } from 'react-bootstrap';
function TestingGroupMasterComponent() {
  const dispatch = useDispatch();

  // // redux state
  const { testingGroupMasterList, isLoading } = useSelector(
    (state) => state?.testingGroupMaster
  );

  const [searchValue, setSearchValue] = useState('');
  const [filteredTestingGroupMasterList, setFilterTestingGroupMasterList] =
    useState([]);

  const [addEditTestingGroupModal, setAddEditTestingGroupModal] = useState({
    type: '',
    data: '',
    open: false
  });

  // Function to handle search button click
  const handleSearch = () => {
    const filteredList = customSearchHandler(
      testingGroupMasterList,
      searchValue
    );
    setFilterTestingGroupMasterList(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchValue('');
    setFilterTestingGroupMasterList(testingGroupMasterList);
  };

  const columns = [
    {
      name: 'Sr. No.',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '70px'
    },
    {
      name: 'Action',
      selector: (row) => (
        <i
          className="icofont-edit text-primary cp"
          onClick={() =>
            setAddEditTestingGroupModal({
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
      name: 'Testing Group Title',
      selector: (row) => row.group_name,
      sortable: false,
      width: '200px'
    },

    {
      name: 'Created At',
      selector: (row) => row.created_at,
      sortable: false,
      width: '175px'
    },

    {
      name: 'Created By',
      selector: (row) => row.created_by,
      sortable: false,
      width: '175px'
    },
    {
      name: 'Updated At',
      selector: (row) => row.updated_at,
      sortable: false,
      width: '175px'
    },

    {
      name: 'Updated By',
      selector: (row) => row.updated_by,
      sortable: false,
      width: '175px'
    }
  ];

  const transformDataForExport = (data) => {
    return data.map((row) => ({
      ...row,
      status: row.is_active == 1 ? 'Active' : 'Deactive'
    }));
  };

  const transformedData = transformDataForExport(
    filteredTestingGroupMasterList
  );

  const exportColumns = [
    { title: 'Testing Group Title', field: 'group_name' },
    { title: 'Status', field: 'status' },

    { title: 'Created At', field: 'created_at' },
    { title: 'Created By', field: 'created_by' },
    { title: 'Updated At', field: 'updated_at' },
    { title: 'Updated By', field: 'updated_by' }
  ];

  useEffect(() => {
    dispatch(getTestingGroupMasterListThunk());
  }, []);

  // Update the useEffect to update the filtered list when testingTypeMasetrList changes
  useEffect(() => {
    setFilterTestingGroupMasterList(testingGroupMasterList);
  }, [testingGroupMasterList]);

  // Function to handle search onchange
  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  return (
    <div className="container-xxl">
      <div className="d-flex justify-content-between">
        <PageHeader headerTitle="Testing Group Master" />
        <div style={{ marginTop: '-30px' }}>
          <button
            className="btn btn-primary text-white "
            onClick={() =>
              setAddEditTestingGroupModal({
                type: 'ADD',
                data: '',
                open: true
              })
            }
          >
            <i className="icofont-plus px-2"></i>
            Add Testing Group
          </button>
        </div>
      </div>

      <Row className="row_gap_3">
        <Col xs={12} md={7} xxl={8}>
          <input
            type="search"
            name="interview_search"
            value={searchValue}
            onChange={(e) => setSearchValue(e?.target?.value)}
            placeholder="Enter review comment..."
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
            apiData={transformedData}
            columns={exportColumns}
            fileName="Testing Group Master Records"
            disabled={!filteredTestingGroupMasterList?.length}
          />
        </Col>
      </Row>

      <DataTable
        columns={columns}
        data={filteredTestingGroupMasterList}
        defaultSortField="role_id"
        pagination
        selectableRows={false}
        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
        highlightOnHover={true}
        progressPending={isLoading?.getTestingGroupMasterList}
        progressComponent={<TableLoadingSkelton />}
      />
      <AddTestingGroupModal
        show={addEditTestingGroupModal?.open}
        type={addEditTestingGroupModal?.type}
        currentTestingGroupData={addEditTestingGroupModal?.data}
        close={(prev) => setAddEditTestingGroupModal({ ...prev, open: false })}
      />
    </div>
  );
}

export default TestingGroupMasterComponent;
