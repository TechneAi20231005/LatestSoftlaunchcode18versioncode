import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

import Alert from '../../../../components/Common/Alert';
import DataTable from 'react-data-table-component';
import Tooltip from 'react-bootstrap/Tooltip';
import { ExportToExcel } from '../../../../components/Utilities/Table/ExportToExcel';
import { Spinner } from 'react-bootstrap';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { getTaskHistory } from '../../../../services/TicketService/TaskService';
export default function TaskHistoryModal(props) {
  const notify = null;

  const [data, setData] = useState();
  const [exportData, setExportData] = useState(null);
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const columns = [
    { name: 'Sr', selector: (row) => row.Sr_No, sortable: true },
    { name: 'Task Id', selector: (row) => row.Task_Id, sortable: true },
    { name: 'Task Type', selector: (row) => row.parent_name, sortable: true },

    {
      name: 'Task Name',
      selector: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.task_name && (
            <div>
              <input
                type="text"
                defaultValue={row.task_name}
                style={{ border: 'none' }}
                readOnly
                title={row && row.task_name ? row.task_name : ''}
              />
            </div>
          )}
        </div>
      )
    },

    {
      name: 'Basket Name',
      selector: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.basket_name && (
            <div>
              <input
                type="text"
                defaultValue={row.basket_name}
                style={{ border: 'none' }}
                readOnly
                title={row && row.basket_name ? row.basket_name : ''}
              />
            </div>
          )}
        </div>
      )
    },
    { name: 'Start Date', selector: (row) => row.start_date, sortable: true },
    { name: 'End Date', selector: (row) => row.end_date, sortable: true },

    { name: 'Priority', selector: (row) => row.priority, sortable: true },

    { name: 'Status', selector: (row) => row.status, sortable: true },

    {
      name: 'Description',
      selector: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.task_desc && (
            <div>
              <input
                type="text"
                defaultValue={row.task_desc}
                style={{ border: 'none' }}
                readOnly
                title={row && row.task_desc ? row.task_desc : ''}
              />
            </div>
          )}
        </div>
      )
    },

    { name: 'Task Hours', selector: (row) => row.task_hours, sortable: true },
    {
      name: 'Created At',
      selector: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.created_at && (
            <OverlayTrigger overlay={<Tooltip>{row.created_at} </Tooltip>}>
              <div>
                <span className="ms-1"> {row.created_at.split(' ')[0]}</span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Updated At',
      selector: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.updated_at && (
            <OverlayTrigger overlay={<Tooltip>{row.updated_at} </Tooltip>}>
              <div>
                <span className="ms-1"> {row.updated_at.split(' ')[0]}</span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Created By',
      selector: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.created_by_name && (
            <div>
              <input
                type="text"
                style={{ border: 'none' }}
                defaultValue={row.created_by_name}
                readOnly
                title={row && row.basket_name ? row.created_by_name : ''}
              />
            </div>
          )}
        </div>
      )
    },
    {
      name: 'Updated By',
      selector: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.updated_by_name && (
            <div>
              <input
                type="text"
                defaultValue={row.updated_by_name}
                readOnly
                style={{ border: 'none' }}
                title={row && row.updated_by_name ? row.updated_by_name : ''}
              />
            </div>
          )}
        </div>
      )
    }
  ];

  const loadData = useCallback(async () => {
    setShowLoaderModal(null);
    setShowLoaderModal(true);
    await new getTaskHistory(props.taskId).then((res) => {
      if (res.status === 200) {
        setShowLoaderModal(false);
        if (res.data.status === 1) {
          let counter = 1;
          var temp = [];
          setData(null);
          res.data.data.forEach((d) => {
            temp.push({
              Sr_No: counter++,
              Task_Id: d.ticket_id,

              task_name: d.task_name,
              basket_name: d.basket_name,
              start_date: d.start_date,
              end_date: d.end_date,
              // id: d.id,
              priority: d.priority,
              status: d.status,
              type_name: d.type_name,

              task_desc: d.task_desc,
              task_hours: d.task_hours,
              created_at: d.created_at,
              updated_at: d.updated_at,
              parent_name: d.parent_name,

              created_by_name: d.created_by_name,
              updated_by_name: d.updated_by_name
              // ticket_basket_id: d.ticket_basket_id,
              // total_worked_in_min: d.total_worked_in_min,
            });
            setExportData(temp);
          });
          setData(temp);
        }
      }
    });
  }, [props.taskId]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  return (
    <>
      {notify && <Alert alertData={notify} />}

      <Modal
        show={props.show}
        onHide={props.hide}
        dialogClassName="modal-100w"
        size="xl"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Task History
            <div
              className="col-md-10"
              style={{
                fontWeight: '600'
              }}
            >
              <ExportToExcel
                className="btn btn-sm btn-danger"
                apiData={exportData}
                fileName="Task History Report"
              />
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {showLoaderModal ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                minHeight: 'calc(100% - 1rem)',
                margin: '0'
              }}
            >
              <div className="text-center">
                <Spinner animation="grow" variant="primary" />
                <Spinner animation="grow" variant="secondary" />
                <Spinner animation="grow" variant="success" />
                <Spinner animation="grow" variant="danger" />
                <Spinner animation="grow" variant="warning" />
                <Spinner animation="grow" variant="info" />
                <Spinner animation="grow" variant="dark" />
              </div>
            </div>
          ) : (
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
                  />
                )}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

// created by Asmita Margaje
