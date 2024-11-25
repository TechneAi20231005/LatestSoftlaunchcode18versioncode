import React, { useEffect, useReducer } from 'react';
import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import PageHeader from '../../../components/Common/PageHeader';
import { useDispatch, useSelector } from 'react-redux';
import { testDraftDetailsHistoryThunk } from '../../../redux/services/testCases/downloadFormatFile';
import { useParams } from 'react-router-dom';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';

function TestCaseHistoryComponent() {
  const { id } = useParams();

  const [paginationData, setPaginationData] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    { rowPerPage: 10, currentPage: 1, currentFilterData: {} }
  );

  const { testDraftHistory, isLoading } = useSelector(
    (state) => state?.downloadFormat
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      testDraftDetailsHistoryThunk({
        id: id,
        limit: paginationData.rowPerPage,
        page: paginationData.currentPage
      })
    );
  }, []);

  const columns = [
    {
      name: (
        <div>
          <span>Module</span>
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
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.changes && row.changes.includes('module_name'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ]
    },

    {
      name: (
        <div>
          <span>Submodule Name</span>
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
      conditionalCellStyles: [
        {
          when: (row) => row.changes && row.changes.includes('sub_module_name'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],
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
      conditionalCellStyles: [
        {
          when: (row) => row.changes && row.changes.includes('function_name'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],
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
      conditionalCellStyles: [
        {
          when: (row) => row.changes && row.changes.includes('field'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],
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
      conditionalCellStyles: [
        {
          when: (row) => row.changes && row.changes.includes('type_name'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],
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
      conditionalCellStyles: [
        {
          when: (row) => row.changes && row.changes.includes('group_name'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],
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
          <i />
        </div>
      ),
      selector: (row) => row.tc_id,
      width: '10rem',
      sortable: true,
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
      conditionalCellStyles: [
        {
          when: (row) => row.changes && row.changes.includes('id'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],
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
      conditionalCellStyles: [
        {
          when: (row) => row.changes && row.changes.includes('severity'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],
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
                  {row.steps && row.steps.length < 20
                    ? row.steps
                    : row.steps.substring(0, 50) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.changes && row.changes.includes('steps'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],
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
        </div>
      ),
      selector: (row) => row.test_description,
      width: '7rem',
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
                <span className="ms-1">
                  {' '}
                  {row.test_description && row.test_description.length < 20
                    ? row.test_description
                    : row.test_description.substring(0, 50) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
      conditionalCellStyles: [
        {
          when: (row) => {
            return row.changes && row.changes.includes('test_description');
          },
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

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
      conditionalCellStyles: [
        {
          when: (row) => row.changes && row.changes.includes('expected_result'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],
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
      conditionalCellStyles: [
        {
          when: (row) => row.changes && row.changes.includes('status'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],
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
      conditionalCellStyles: [
        {
          when: (row) => row.changes && row.changes.includes('project_name'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],
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
          <span>Operation</span>
        </div>
      ),
      selector: (row) => row.operation,
      width: '7rem',
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.operation && (
            <OverlayTrigger overlay={<Tooltip>{row.operation} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.operation && row.operation.length < 20
                    ? row.operation
                    : row.operation.substring(0, 50) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.changes && row.changes.includes('project_name'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],
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
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.changes && row.changes.includes('created_at'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ]
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
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.changes && row.changes.includes('created_by'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ]
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
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.changes && row.changes.includes('updated_at'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ]
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
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.changes && row.changes.includes('updated_by'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ]
    }
  ];

  return (
    <>
      <PageHeader headerTitle="Test Case History" />
      <Container fluid className="employee_joining_details_container">
        <DataTable
          columns={columns}
          data={testDraftHistory}
          defaultSortField="role_id"
          pagination
          paginationServer
          paginationTotalRows={testDraftHistory?.total}
          paginationDefaultPage={testDraftHistory?.currentPage}
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
        />
        <div className="d-flex justify-content-end mt-3">
          <button
            onClick={() => window.history.back()}
            className="btn btn-primary text-white "
          >
            Back
          </button>
        </div>
      </Container>
    </>
  );
}

export default TestCaseHistoryComponent;
