import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import PageHeader from '../../../components/Common/PageHeader';
import { useDispatch, useSelector } from 'react-redux';
import { customSearchHandler } from '../../../utils/customFunction';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import AddTestingTypeModal from './AddTestingTypeModal';
import { getTestingTypeMasterListThunk } from '../../../redux/services/testCases/testingTypeMaster';
import { Col, Row } from 'react-bootstrap';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportDataFile';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
function TestingTypeMasterComponent() {
  const dispatch = useDispatch();

  // // redux state
  const { testingTypeMasterList, isLoading } = useSelector(
    (state) => state?.testingTypeMaster
  );
  const [searchValue, setSearchValue] = useState('');
  const [reset, setReset] = useState(false);

  const [filteredTestingTypeMasterList, setFilterTestingTypeMasterList] =
    useState([]);

  const [addEditTestingTypeModal, setAddEditTestingTypeModal] = useState({
    type: '',
    data: '',
    open: false
  });

  const handleSearch = () => {
    const filteredList = customSearchHandler(
      testingTypeMasterList,
      searchValue
    );
    setFilterTestingTypeMasterList(filteredList);
  };

  const handleReset = () => {
    setSearchValue('');
    setFilterTestingTypeMasterList(testingTypeMasterList);
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
  //     selector: (row) => (
  //       <i
  //         className="icofont-edit text-primary cp"
  //         onClick={() =>
  //           setAddEditTestingTypeModal({
  //             type: 'EDIT',
  //             data: row,
  //             open: true
  //           })
  //         }
  //       />
  //     ),
  //     sortable: false,
  //     width: '70px'
  //   },

  //   {
  //     name: 'Status',
  //     selector: (row) => row.is_active,
  //     sortable: true,
  //     cell: (row) => (
  //       <div>
  //         {row.is_active == 1 && (
  //           <span className="badge bg-primary" style={{ width: '4rem' }}>
  //             Active
  //           </span>
  //         )}
  //         {row.is_active == 0 && (
  //           <span className="badge bg-danger" style={{ width: '4rem' }}>
  //             Deactive
  //           </span>
  //         )}
  //       </div>
  //     ),
  //     width: '100px'
  //   },

  //   {
  //     name: 'Testing Type Title',
  //     selector: (row) => row?.type_name,
  //     sortable: false,
  //     width: '200px',
  //     cell: (row) => (
  //       <>
  //         <a data-tooltip-id={`my-tooltip-click-${row?.id}`}>
  //           <Tooltip
  //             id={`my-tooltip-click-${row?.id}`}
  //             content={row.type_name}
  //             openOnClick
  //           ></Tooltip>
  //           {row?.type_name}
  //         </a>
  //       </>
  //     )
  //   },

  //   {
  //     name: 'Created At',
  //     selector: (row) => row.created_at,
  //     sortable: false,
  //     width: '175px'
  //   },

  //   {
  //     name: 'Created By',
  //     selector: (row) =>
  //       (row?.created_by?.first_name || '-' + ' ') +
  //       ' ' +
  //       (row?.created_by?.last_name || '-'),
  //     sortable: false,
  //     width: '175px'
  //   },
  //   {
  //     name: 'Updated At',
  //     selector: (row) => row.updated_at || '- -',
  //     sortable: false,
  //     width: '175px'
  //   },

  //   {
  //     name: 'Updated By',
  //     selector: (row) =>
  //       (row?.updated_by?.first_name || '-' + ' ') +
  //       ' ' +
  //       (row?.updated_by?.last_name || '-'),
  //     sortable: false,
  //     width: '175px'
  //   }
  // ];

  const columns = [
    {
      accessorKey: 'counter',
      header: 'Sr',
      // cell: (row, index) => {
      //   return row?.index + 1;
      // },
      size: 70,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableColumnFilter: false
    },
    {
      accessorKey: 'action', // Use a valid key
      header: 'Action',
      size: 110,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableSorting: false,
      enableColumnFilter: false,

      Cell: ({ row }) => {
        return (
          <div className="btn-group" role="group">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-toggle="modal"
              data-bs-target="#edit"
              onClick={() =>
                setAddEditTestingTypeModal({
                  type: 'EDIT',
                  data: row?.original,
                  open: true
                })
              }
            >
              <i className="icofont-edit text-success"></i>
            </button>
          </div>
        );
      }
    },

    {
      accessorKey: 'is_active',
      header: 'Status',
      size: 150,
      accessorFn: (row) => (row.is_active === 1 ? 'Active' : 'Deactive'),
      filterFn: (row, id, filterValue) => {
        const status = row.getValue(id);
        return status.toLowerCase().includes(filterValue.toLowerCase());
      },
      Cell: ({ row }) => {
        const isActive = row?.original?.is_active;
        return (
          <span
            className={`badge ${isActive ? 'bg-primary' : 'bg-danger'}`}
            style={{ width: '4rem' }}
          >
            {isActive ? 'Active' : 'Deactive'}
          </span>
        );
      }
    },
    {
      accessorKey: 'type_name',
      header: 'Testing Type Title',
      size: 160,
      filterVariant: 'autocomplete',
      muiTableBodyCellProps: () => ({
        sx: {
          color: '#f19828',
          fontWeight: 400
        }
      })
    },

    {
      accessorFn: (originalRow) => {
        return moment(originalRow.created_at).startOf('day').toDate();
      },
      header: 'Created At',
      filterVariant: 'date',
      Cell: ({ cell }) =>
        moment(cell.row.original.created_at).format('MM/DD/YYYY HH:mm:ss')
    },
    {
      accessorFn: (originalRow) =>
        `${originalRow?.created_by?.first_name || ''} ${
          originalRow?.created_by?.last_name || ''
        }`.trim() || '--',
      header: 'Created By'
    },

    {
      accessorFn: (originalRow) => originalRow?.updated_at || '--',
      header: 'Updated At'
    },

    {
      accessorFn: (originalRow) =>
        `${originalRow?.updated_by?.first_name || ''} ${
          originalRow?.updated_by?.last_name || ''
        }`.trim() || '--',
      header: 'Updated By'
    }
  ];

  const exportDataKeys = {
    type_name: 'Testing Type Title',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Testing Type Master'
  };
  const transformDataForExport = (data) => {
    return data.map((row) => ({
      ...row,
      created_by:
        (row?.created_by?.first_name || '-' + ' ') +
        ' ' +
        (row?.created_by?.last_name || '-'),

      updated_by:
        (row?.updated_by?.first_name || '-' + ' ') +
        ' ' +
        (row?.updated_by?.last_name || '-'),
      status: row.is_active == 1 ? 'Active' : 'Deactive'
    }));
  };

  const transformedData = transformDataForExport(filteredTestingTypeMasterList);

  const exportColumns = [
    { title: 'Testing Type Title', field: 'type_name' },
    { title: 'Status', field: 'status' },

    { title: 'Created At', field: 'created_at' },
    { title: 'Created By', field: 'created_by' },
    { title: 'Updated At', field: 'updated_at' },
    { title: 'Updated By', field: 'updated_by' }
  ];

  useEffect(() => {
    dispatch(getTestingTypeMasterListThunk());
  }, []);

  useEffect(() => {
    setFilterTestingTypeMasterList(testingTypeMasterList);
  }, [testingTypeMasterList]);

  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  return (
    <div className="container-xxl">
      <div className="d-flex justify-content-between">
        <PageHeader headerTitle="Testing Type Master" />
        <div>
          <button
            className="btn btn-primary text-white "
            onClick={() =>
              setAddEditTestingTypeModal({
                type: 'ADD',
                data: '',
                open: true
              })
            }
          >
            <i className="icofont-plus px-2"></i>
            Add Testing Type
          </button>
        </div>
      </div>

      {/* <Row className="row_gap_3">
        <Col xs={12} md={7} xxl={8}>
          <input
            type="search"
            name="interview_search"
            id="testingtypemaster_interviewsearch"
            value={searchValue}
            onChange={(e) => setSearchValue(e?.target?.value)}
            placeholder="Search testing type here..."
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
            fileName="Testing Type Master Records"
            disabled={!filteredTestingTypeMasterList?.length}
          />
        </Col>
      </Row> */}

      {/* <DataTable
        columns={columns}
        data={filteredTestingTypeMasterList}
        defaultSortField="role_id"
        pagination
        selectableRows={false}
        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
        highlightOnHover={true}
        progressPending={isLoading?.getTestingTypeMasterList}
        progressComponent={<TableLoadingSkelton />}
      /> */}
      <div className="mt-2">
        {filteredTestingTypeMasterList && (
          <MaterialTable
            columns={columns}
            data={filteredTestingTypeMasterList}
            isLoading={isLoading?.filteredTestingTypeMasterList}
            reset={reset}
            setReset={setReset}
            exportDataKeys={exportDataKeys}
          ></MaterialTable>
        )}
        <AddTestingTypeModal
          show={addEditTestingTypeModal?.open}
          type={addEditTestingTypeModal?.type}
          currentTestingTypeData={addEditTestingTypeModal?.data}
          close={(prev) => setAddEditTestingTypeModal({ ...prev, open: false })}
          reset={reset}
          setReset={setReset}
        />
      </div>
    </div>
  );
}

export default TestingTypeMasterComponent;
