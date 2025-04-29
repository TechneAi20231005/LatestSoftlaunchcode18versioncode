import React, { useEffect, useReducer, useState } from 'react';
import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import PageHeader from '../../../components/Common/PageHeader';
import { useDispatch, useSelector } from 'react-redux';
import {
  testDraftDetailsHistoryThunk,
  testPlansHistoryThunk
} from '../../../redux/services/testCases/downloadFormatFile';
import { useParams } from 'react-router-dom';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';

function TestPlanHistoryComponent() {
  const { id } = useParams();

  // const [paginationData, setPaginationData] = useReducer(
  //   (prevState, nextState) => {
  //     return { ...prevState, ...nextState };
  //   },
  //   { rowPerPage: 10, currentPage: 1, currentFilterData: {} }
  // );

    const [paginationData, setPaginationData] = useState({
      pageIndex: 0,
      pageSize: 10
    })

  const { testPlantHistory, isLoading } = useSelector(
    (state) => state?.downloadFormat
  );

  const dispatch = useDispatch();

  useEffect(() => {
    //   dispatch(
    //     testDraftDetailsHistoryThunk({
    //       id: id,
    //       limit: paginationData.rowPerPage,
    //       page: paginationData.currentPage
    //     })
    //   );
    // }, []);
    dispatch(
      testPlansHistoryThunk({
        id: id,
        limit: paginationData.pageSize,
        page: paginationData.pageIndex + 1
      })
    );
  }, [paginationData.pageIndex, paginationData.pageSize]);

  // const columns = [
  //   {
  //     name: (
  //       <div>
  //         <span>Test Plan Id</span>
  //         <i
  //         // onClick={(e) =>
  //         //   handleFilterClick(e, 'module_name', 'Module', 'text')
  //         // }
  //         // className="icofont-filter ms-2"
  //         />
  //       </div>
  //     ),

  //     selector: (row) => row.test_plan_id,

  //     width: '10rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.test_plan_id && (
  //           <OverlayTrigger overlay={<Tooltip>{row.test_plan_id} </Tooltip>}>
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {row.test_plan_id && row.test_plan_id.length < 20
  //                   ? row.test_plan_id
  //                   : row.test_plan_id.substring(0, 50) + '....'}
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
  //     ),
  //     conditionalCellStyles: [
  //       {
  //         when: (row) => row.changes && row.changes.includes('module_name'),
  //         style: {
  //           color: 'red',
  //           fontWeight: 'bold',
  //           '&:hover': {
  //             cursor: 'pointer'
  //           }
  //         }
  //       }
  //     ]
  //   },

  //   {
  //     name: (
  //       <div>
  //         <span>Tester Name</span>
  //         <i
  //         // onClick={(e) =>
  //         //   handleFilterClick(e, 'sub_module_name', 'Submodule Name', 'text')
  //         // }
  //         // className="icofont-filter ms-2"
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
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {row.tester_name && row.tester_name.length < 20
  //                   ? row.tester_name
  //                   : row.tester_name.substring(0, 50) + '....'}
  //               </span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     conditionalCellStyles: [
  //       {
  //         when: (row) => row.changes && row.changes.includes('sub_module_name'),
  //         style: {
  //           color: 'red',
  //           fontWeight: 'bold',
  //           '&:hover': {
  //             cursor: 'pointer'
  //           }
  //         }
  //       }
  //     ],
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
  //         <span>Reviewer Name</span>
  //         <i
  //         // onClick={(e) =>
  //         //   handleFilterClick(e, 'function_name', 'Function', 'text')
  //         // }
  //         // className="icofont-filter ms-2"
  //         />
  //       </div>
  //     ),
  //     selector: (row) => row.reviewer_name,
  //     width: '7rem',
  //     sortable: false,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.reviewer_name && (
  //           <OverlayTrigger overlay={<Tooltip>{row.reviewer_name} </Tooltip>}>
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {row.reviewer_name && row.reviewer_name.length < 20
  //                   ? row.reviewer_name
  //                   : row.reviewer_name.substring(0, 50) + '....'}
  //               </span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     conditionalCellStyles: [
  //       {
  //         when: (row) => row.changes && row.changes.includes('function_name'),
  //         style: {
  //           color: 'red',
  //           fontWeight: 'bold',
  //           '&:hover': {
  //             cursor: 'pointer'
  //           }
  //         }
  //       }
  //     ],
  //     header: (column, sortDirection) => (
  //       <div className="d-flex align-items-center">
  //         <span>{column.name}</span>
  //         <i className="icofont-history cp bg-warning rounded-circle ms-2" />
  //       </div>
  //     )
  //   },

  //   {
  //     name: 'Created At',
  //     selector: (row) => row.created_at,
  //     width: '7rem',
  //     sortable: true,
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
  //                 {row.created_at && row.created_at.length < 20
  //                   ? row.created_at
  //                   : row.created_at.substring(0, 50) + '....'}
  //               </span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     conditionalCellStyles: [
  //       {
  //         when: (row) => row.changes && row.changes.includes('created_at'),
  //         style: {
  //           color: 'red',
  //           fontWeight: 'bold',
  //           '&:hover': {
  //             cursor: 'pointer'
  //           }
  //         }
  //       }
  //     ]
  //   },

  //   {
  //     name: 'Created By',
  //     selector: (row) => row?.created_by,
  //     width: '7rem',
  //     sortable: true,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row?.created_by && (
  //           <OverlayTrigger overlay={<Tooltip>{row?.created_by} </Tooltip>}>
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {(row?.created_by?.first_name || '-' + ' ') +
  //                   ' ' +
  //                   (row?.created_by?.last_name || '-')}
  //               </span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     conditionalCellStyles: [
  //       {
  //         when: (row) => row.changes && row.changes.includes('created_by'),
  //         style: {
  //           color: 'red',
  //           fontWeight: 'bold',
  //           '&:hover': {
  //             cursor: 'pointer'
  //           }
  //         }
  //       }
  //     ]
  //   },

  //   {
  //     name: 'Updated At',
  //     selector: (row) => row.updated_at,
  //     width: '7rem',
  //     sortable: true,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.updated_at && (
  //           <OverlayTrigger overlay={<Tooltip>{row.updated_at} </Tooltip>}>
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {row.updated_at && row.updated_at.length < 20
  //                   ? row.updated_at
  //                   : row.updated_at.substring(0, 50) + '....'}
  //               </span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     conditionalCellStyles: [
  //       {
  //         when: (row) => row.changes && row.changes.includes('updated_at'),
  //         style: {
  //           color: 'red',
  //           fontWeight: 'bold',
  //           '&:hover': {
  //             cursor: 'pointer'
  //           }
  //         }
  //       }
  //     ]
  //   },

  //   {
  //     name: 'Updated By',
  //     selector: (row) => row.updated_by,
  //     width: '7rem',
  //     sortable: true,
  //     cell: (row) => (
  //       <div
  //         className="btn-group"
  //         role="group"
  //         aria-label="Basic outlined example"
  //       >
  //         {row.updated_by && (
  //           <OverlayTrigger overlay={<Tooltip>{row.updated_by} </Tooltip>}>
  //             <div>
  //               <span className="ms-1">
  //                 {' '}
  //                 {(row?.updated_by?.first_name || '-' + ' ') +
  //                   ' ' +
  //                   (row?.updated_by?.last_name || '-')}
  //               </span>
  //             </div>
  //           </OverlayTrigger>
  //         )}
  //       </div>
  //     ),
  //     conditionalCellStyles: [
  //       {
  //         when: (row) => row.changes && row.changes.includes('updated_by'),
  //         style: {
  //           color: 'red',
  //           fontWeight: 'bold',
  //           '&:hover': {
  //             cursor: 'pointer'
  //           }
  //         }
  //       }
  //     ]
  //   }
  // ];
  const columns = [
    {
      accessorKey: 'test_plan_id',
      header: 'Test Plan Id',
      size: 190,
      enableColumnFilter: true
    },
    {
      accessorFn: (row) => row?.tester_name || '--',
      header: 'Tester Name',
      size: 190,
      enableColumnFilter: true
    },
    {
      accessorFn: (row) => row?.reviewer_name || '--',
      header: 'Reviewer Name',
      size: 210,
      enableColumnFilter: true
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
      size: 180,
      enableColumnFilter: true
    },
    {
      accessorFn: (row) =>
        `${row?.created_by?.first_name || '-'} ${
          row?.created_by?.last_name || '-'
        }`,
      header: 'Created By',
      size: 180,
      enableColumnFilter: true
    },
    {
      accessorFn: (row) => row?.updated_at || '--',
      header: 'Updated At',
      size: 180,
      enableColumnFilter: true
    },
    {
      accessorFn: (row) =>
        `${row?.updated_by?.first_name || '-'} ${
          row?.updated_by?.last_name || '-'
        }`,
      header: 'Updated By',
      size: 185,
      enableColumnFilter: true
    }
  ];
  console.log(testPlantHistory, 'testPlantHistory?.total');
  return (
    <>
      <PageHeader showBackBtn headerTitle="Test Plan History" />
      <Container fluid className="mt-3">
        <MaterialTable
          columns={columns}
          data={testPlantHistory}
          isLoading={isLoading?.testDraftHistory}
          enableRowNumbers={true}
          paginationData={paginationData}
          setPaginationData={setPaginationData}
          isExportData={false}
          manualPagination={true}
        />
        {/* <DataTable
          columns={columns}
          data={testPlantHistory}
          defaultSortField="role_id"
          pagination
          paginationServer
          paginationTotalRows={testPlantHistory?.total}
          paginationDefaultPage={testPlantHistory?.currentPage}
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
          progressPending={isLoading?.testDraftHistory}
          progressComponent={<TableLoadingSkelton />}
        /> */}
      </Container>
    </>
  );
}

export default TestPlanHistoryComponent;
