import React, { useEffect, useState } from 'react';
import PageHeader from '../../../../components/Common/PageHeader';
import TestCaseService from '../../../../services/TicketService/TestCaseService';
import DataTable from 'react-data-table-component';
import Select from 'react-select';

import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { useParams } from 'react-router-dom';

const TestCaseHistory = ({ match }) => {
  const { id } = useParams();

  const [data, setData] = useState();

  const columns = [
    { name: 'Sr', selector: (row) => row.counter, sortable: true },

    {
      name: 'TicketId',
      selector: (row) => row.ticket_id,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.ticket_id && (
            <OverlayTrigger overlay={<Tooltip>{row.ticket_id} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.ticket_id && row.ticket_id.length < 10
                    ? row.ticket_id
                    : row.ticket_id.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Test Case Id',
      selector: (row) => row.test_case_id,
      sortable: true
    },
    {
      name: 'Platform',
      selector: (row) => row.platform,
      sortable: true,

      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('platform'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

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
                  {row.platform && row.platform.length < 10
                    ? row.platform
                    : row.platform.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'APK Version',
      selector: (row) => row.apk_version,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('apk_version'),
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
      name: 'OS Version',
      selector: (row) => row.os_version,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('os_version'),
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
      name: 'Module Name ',
      selector: (row) => row.module_name,
      sortable: true,
      width: '150px',
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('module_name'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.module_name && (
            <OverlayTrigger overlay={<Tooltip>{row.module_name} </Tooltip>}>
              <div>
                <span className="ms-1"> {row.module_name}</span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Submodule Name',
      selector: (row) => row.sub_module_name,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('submodule_name'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ]

      // cell: (row) =>
      // <div className="btn-group" role="group" aria-label="Basic outlined example">

      //         {row.submodule_name &&
      //             <OverlayTrigger overlay={<Tooltip>{row.sub_module_name} </Tooltip>}>
      //                 <div>
      //                     <span className="ms-1"> {row.sub_module_name && row.submodule_name.length < 10 ? row.sub_module_name : row.sub_module_name.substring(0, 10) + "...."}</span>
      //                 </div>
      //             </OverlayTrigger>
      //         }

      // </div>
    },

    {
      name: 'Function',
      selector: (row) => row.function,
      sortable: true,

      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('function'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.function && (
            <OverlayTrigger overlay={<Tooltip>{row.function} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.function && row.function.length < 10
                    ? row.function
                    : row.function.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Field',
      selector: (row) => row.field,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('field'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

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
                  {row.field && row.field.length < 10
                    ? row.field
                    : row.field.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Testing Type',
      selector: (row) => row.testing_type_name,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('testing_type'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.testing_type_name && (
            <OverlayTrigger
              overlay={<Tooltip>{row.testing_type_name} </Tooltip>}
            >
              <div>
                <span className="ms-1">
                  {' '}
                  {row.testing_type_name && row.testing_type_name.length < 10
                    ? row.testing_type_name
                    : row.testing_type_name.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Test Description',
      selector: (row) => row.test_description,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('test_description'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

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
                  {row.test_description && row.test_description.length < 10
                    ? row.test_description
                    : row.test_description.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Expected Result',
      selector: (row) => row.expected_result,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('expected_result'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

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
                  {row.expected_result && row.expected_result.length < 10
                    ? row.expected_result
                    : row.expected_result.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Actual Result',
      selector: (row) => row.actual_result,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('actual_result'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.actual_result && (
            <OverlayTrigger overlay={<Tooltip>{row.actual_result} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.actual_result && row.actual_result.length < 10
                    ? row.actual_result
                    : row.actual_result.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Tester Status',
      selector: (row) => row.tester_status,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('tester_status'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.tester_status && (
            <OverlayTrigger overlay={<Tooltip>{row.tester_status} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.tester_status && row.tester_status.length < 10
                    ? row.tester_status
                    : row.tester_status.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Severity',
      selector: (row) => row.severity,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('severity'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.severity && (
            <OverlayTrigger overlay={<Tooltip>{row.severity} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.severity && row.severity.length < 10
                    ? row.severity
                    : row.severity.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Priority',
      selector: (row) => row.priority,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('priority'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.priority && (
            <OverlayTrigger overlay={<Tooltip>{row.priority} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.priority && row.priority.length < 10
                    ? row.priority
                    : row.priority.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Script Path',
      selector: (row) => row.script_path,
      sortable: true,

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.script_path && (
            <OverlayTrigger overlay={<Tooltip>{row.script_path} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.script_path && row.script_path.length < 10
                    ? row.script_path
                    : row.script_path.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'operation',
      selector: (row) => row.operation,
      sortable: true,
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
                  {row.operation && row.operation.length < 10
                    ? row.operation
                    : row.operation.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    { name: 'Task Id', selector: (row) => row.task_id, sortable: true },

    {
      name: 'Tester Comments',
      selector: (row) => row.tester_comments,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('tester_comments'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.tester_comments && (
            <OverlayTrigger overlay={<Tooltip>{row.tester_comments} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.tester_comments && row.tester_comments.length < 10
                    ? row.tester_comments
                    : row.tester_comments.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'BA Status',
      selector: (row) => row.ba_status,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('ba_status'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.ba_status && (
            <OverlayTrigger overlay={<Tooltip>{row.ba_status} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.ba_status && row.ba_status.length < 10
                    ? row.ba_status
                    : row.ba_status.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'BA Comments',
      selector: (row) => row.ba_comments,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('ba_comments'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.ba_comments && (
            <OverlayTrigger overlay={<Tooltip>{row.ba_comments} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.ba_comments && row.ba_comments.length < 10
                    ? row.ba_comments
                    : row.ba_comments.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Dev Status',
      selector: (row) => row.dev_status,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('dev_status'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.dev_status && (
            <OverlayTrigger overlay={<Tooltip>{row.dev_status} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.dev_status && row.dev_status.length < 10
                    ? row.dev_status
                    : row.dev_status.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Dev Comments',
      selector: (row) => row.dev_comments,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('dev_comments'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.dev_comments && (
            <OverlayTrigger overlay={<Tooltip>{row.dev_comments} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.dev_comments && row.dev_comments.length < 10
                    ? row.dev_comments
                    : row.dev_comments.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Approved Status Change By',
      selector: (row) => row.approved_status_change_by,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('approved_status_change_by'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.approved_status_change_by && (
            <OverlayTrigger
              overlay={<Tooltip>{row.approved_status_change_by} </Tooltip>}
            >
              <div>
                <span className="ms-1"> {row.approved_status_change_by}</span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Approved Status',
      selector: (row) =>
        row.approved_status == 1 ? (
          <span>Approved</span>
        ) : (
          <span>Rejected</span>
        ),
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('apprved_status'),
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
      name: 'Approved At',
      selector: (row) => row.approved_at,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('approved_at'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.approved_at && (
            <OverlayTrigger overlay={<Tooltip>{row.approved_at} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.approved_at && row.approved_at.length < 10
                    ? row.approved_at
                    : row.approved_at.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Attachment Name',
      selector: (row) => row.attachment_name,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('attachment_name'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.attachment_name && (
            <OverlayTrigger overlay={<Tooltip>{row.attachment_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.attachment_name && row.attachment_name.length < 10
                    ? row.attachment_name
                    : row.attachment_name.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Created At',
      selector: (row) => row.created_at,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('created_at'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

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
                  {row.created_at && row.created_at.length < 10
                    ? row.created_at
                    : row.created_at.substring(0, 10) + '....'}
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
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('created_by'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

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
                  {row.created_by && row.created_by.length < 10
                    ? row.created_by
                    : row.created_by.substring(0, 10) + '....'}
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
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('updated_at'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

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
                  {row.updated_at && row.updated_at.length < 10
                    ? row.updated_at
                    : row.updated_at.substring(0, 10) + '....'}
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
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('updated_by'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ],

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
                  {row.updated_by && row.updated_by.length < 10
                    ? row.updated_by
                    : row.updated_by.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    }
  ];

  // const conditionalRowStyles = [
  //   {
  //     when: row => row.operation=="UPDATE",
  //     style: {
  //       color: "red"
  //     }
  //   }
  // ];

  const loadData = async () => {
    await new TestCaseService().getHistory(id).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          let counter = 1;
          const tempData = [];
          const temp = res.data.data;
          for (const key in temp) {
            tempData.push({
              counter: counter++,
              mainId: temp[key].mainId,
              operation: temp[key].operation,
              ticket_id: temp[key].ticket_id,
              task_id: temp[key].task_id,
              test_case_id: temp[key].test_case_id,
              function: temp[key].function,
              testing_type: temp[key].testing_type,
              testing_type_name: temp[key].testing_type_name,
              module_name: temp[key].module_name,
              sub_module_name: temp[key].sub_module_name,
              platform: temp[key].platform,
              apk_version: temp[key].apk_version,
              os_version: temp[key].os_version,
              steps_to_follow: temp[key].steps_to_follow,
              test_description: temp[key].test_description,
              expected_result: temp[key].expected_result,
              actual_result: temp[key].actual_result,
              severity: temp[key].severity,
              tester_status: temp[key].tester_status,
              tester_comments: temp[key].tester_comments,
              ba_status: temp[key].ba_status,
              dev_status: temp[key].dev_status,
              approved_status: temp[key].approved_status,
              dev_comments: temp[key].dev_comments,
              passed_status_changed_by: temp[key].passed_status_changed_by,
              attachment_name: temp[key].attachment_name,
              created_at: temp[key].created_at,
              created_by: temp[key].created_by,
              updated_at: temp[key].updated_at,
              updated_by: temp[key].updated_by,
              changes: temp[key].changes,
              field: temp[key].field,
              priority: temp[key].priority,
              script_path: temp[key].script_path
            });
          }
          setData(tempData);
        }
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div>
        {/* Page Header */}
        <div className="container-xxl">
          <PageHeader headerTitle="Test-Case History" />
        </div>
        <div className="card mt-2">
          <div className="card-body">
            <div className="row clearfix g-3">
              <div className="col-sm-12">
                {data && (
                  <DataTable
                    columns={columns}
                    data={data}
                    defaultSortField="title"
                    pagination
                    selectableRows={false}
                    className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                    highlightOnHover={true}
                    // conditionalRowStyles={conditionalRowStyles}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestCaseHistory;
