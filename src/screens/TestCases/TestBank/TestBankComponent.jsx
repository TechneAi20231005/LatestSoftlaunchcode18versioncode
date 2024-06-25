import React, { useEffect, useReducer } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { _base } from '../../../settings/constants';
import PageHeader from '../../../components/Common/PageHeader';
import { getTestBankMasterListThunk } from '../../../redux/services/testCases/testBank';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportDataFile';

function TestBankComponent() {
  // // initial state
  const dispatch = useDispatch();

  const [paginationData, setPaginationData] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    { rowPerPage: 10, currentPage: 1, currentFilterData: {} }
  );

  const { testBankList, isLoading } = useSelector((state) => state?.testBank);

  const columns = [
    {
      name: 'Module',
      selector: (row) => row.module_name,
      sortable: false,
      width: '10rem'
    },
    {
      name: 'Submodule',
      selector: (row) => row.sub_module_name,
      sortable: false,
      width: '7rem'
    },
    {
      name: 'Function',
      selector: (row) => row.function_name,
      sortable: false,
      width: '10rem'
    },
    {
      name: 'Field',
      selector: (row) => row.field,
      sortable: false,
      width: '10rem'
    },
    {
      name: 'Testing Type',
      selector: (row) => row.type_name,
      sortable: false,
      width: '10rem'
    },

    {
      name: 'Testing Group',
      selector: (row) => row.group_name,
      sortable: false,
      width: '10rem'
    },
    {
      name: 'Testing ID',
      selector: (row) => row.id,
      sortable: false,
      width: '10rem'
    },

    {
      name: 'Severity',
      selector: (row) => row.severity,
      sortable: false,
      width: '10rem'
    },

    {
      name: 'Testing Description',
      selector: (row) => row.test_description,
      sortable: false,
      width: '10rem'
    },
    {
      name: 'Steps',
      selector: (row) => row.steps,
      sortable: false,
      width: '10rem'
    },
    {
      name: 'Expected Result',
      selector: (row) => row.expected_result,
      sortable: false,
      width: '10rem'
    },

    {
      name: 'Project',
      selector: (row) => row.project_name,
      sortable: false,
      width: '10rem'
    },
    {
      name: 'Created At',
      selector: (row) => row.created_at,
      sortable: false,
      width: '7rem'
    },

    {
      name: 'Created At',
      selector: (row) => row.created_by,
      sortable: false,
      width: '7rem'
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
    { title: 'Expected Result', field: 'expected_result' },
    { title: 'Project', field: 'project_name' },
    { title: 'Created At', field: 'created_at' },
    { title: 'Created By', field: 'created_by' }
  ];

  useEffect(() => {
    dispatch(
      getTestBankMasterListThunk({
        limit: paginationData.rowPerPage,
        page: paginationData.currentPage
      })
    );
  }, [paginationData.rowPerPage, paginationData.currentPage]);
  return (
    <>
      <PageHeader
        headerTitle="Test Bank"
        renderRight={() => {
          return (
            <div className="d-flex justify-content-sm-end btn_container">
              <ExportToExcel
                className="btn btn-danger"
                apiData={testBankList}
                columns={exportColumns}
                fileName="Test Bank Records"
                disabled={!testBankList?.length}
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
          data={testBankList}
          defaultSortField="role_id"
          pagination
          paginationServer
          paginationTotalRows={testBankList?.total?.total_count}
          paginationDefaultPage={paginationData.currentPage}
          onChangePage={(page) => setPaginationData({ currentPage: page })}
          onChangeRowsPerPage={(newPageSize) => {
            setPaginationData({ rowPerPage: newPageSize });
            setPaginationData({ currentPage: 1 });
          }}
          paginationRowsPerPageOptions={[10, 15, 20, 25, 30]}
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
          progressPending={isLoading?.testBankList}
          progressComponent={<TableLoadingSkelton />}
        />
      </Container>
    </>
  );
}

export default TestBankComponent;
