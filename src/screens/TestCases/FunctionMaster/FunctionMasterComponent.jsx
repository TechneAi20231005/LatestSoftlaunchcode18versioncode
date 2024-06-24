import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import PageHeader from '../../../components/Common/PageHeader';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportDataFile';
import { customSearchHandler } from '../../../utils/customFunction';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import { getFunctionMasterListThunk } from '../../../redux/services/testCases/functionMaster';
import AddEditFunctionMaster from './AddEditFunctionMaster';
function FunctionMasterComponent() {
  const dispatch = useDispatch();

  // // redux state
  const { functionMasterList, isLoading } = useSelector(
    (state) => state?.functionMaster
  );
  const [searchValue, setSearchValue] = useState('');

  const [filteredFunctionMasterList, setFilterFunctionMasterList] = useState(
    []
  );

  const [addEditFunctionModal, setAddEditFunctionModal] = useState({
    type: '',
    data: '',
    open: false
  });

  const handleSearch = () => {
    const filteredList = customSearchHandler(functionMasterList, searchValue);
    setFilterFunctionMasterList(filteredList);
  };

  const handleReset = () => {
    setSearchValue('');
    setFilterFunctionMasterList(functionMasterList);
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
            setAddEditFunctionModal({
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
      name: 'Function Title',
      selector: (row) => row.function_name,
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

  const exportColumns = [
    { title: 'Function Title', field: 'function_name' },
    { title: 'Created At', field: 'created_at' },
    { title: 'Created By', field: 'created_by' },
    { title: 'Updated At', field: 'updated_at' },
    { title: 'Updated By', field: 'updated_by' }
  ];

  useEffect(() => {
    dispatch(getFunctionMasterListThunk());
  }, []);

  useEffect(() => {
    setFilterFunctionMasterList(functionMasterList);
  }, [functionMasterList]);

  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  return (
    <div className="container-xxl">
      <div className="d-flex justify-content-between">
        <PageHeader headerTitle="Function Master" />
        <div style={{ marginTop: '-30px' }}>
          <button
            className="btn btn-primary text-white "
            onClick={() =>
              setAddEditFunctionModal({
                type: 'ADD',
                data: '',
                open: true
              })
            }
          >
            <i className="icofont-plus px-2"></i>
            Add Function Type
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
            apiData={filteredFunctionMasterList}
            columns={exportColumns}
            fileName="Function Master Records"
            disabled={!filteredFunctionMasterList?.length}
          />
        </Col>
      </Row>

      <DataTable
        columns={columns}
        data={filteredFunctionMasterList}
        defaultSortField="role_id"
        pagination
        selectableRows={false}
        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
        highlightOnHover={true}
        progressPending={isLoading?.getFunctionMasterList}
        progressComponent={<TableLoadingSkelton />}
      />
      <AddEditFunctionMaster
        show={addEditFunctionModal?.open}
        type={addEditFunctionModal?.type}
        currentFunctionData={addEditFunctionModal?.data}
        close={(prev) => setAddEditFunctionModal({ ...prev, open: false })}
      />
    </div>
  );
}

export default FunctionMasterComponent;
