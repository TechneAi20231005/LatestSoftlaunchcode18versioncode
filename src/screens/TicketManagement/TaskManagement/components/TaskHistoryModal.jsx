import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';

import Alert from '../../../../components/Common/Alert';
import DataTable from 'react-data-table-component';
import Tooltip from 'react-bootstrap/Tooltip';
import { ExportToExcel } from '../../../../components/Utilities/Table/ExportToExcel';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import { useDispatch, useSelector } from 'react-redux';
import { getTaskHistoryListThunk } from '../../../../redux/services/TaskHistory';
import TableLoadingSkelton from '../../../../components/custom/loader/TableLoadingSkelton';

export default function TaskHistoryModal(props) {
  const dispatch = useDispatch();
  const [notify, setNotify] = useState();

  const { filterTaskData, isLoading } = useSelector(
    (state) => state?.taskHistory
  );

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

  const loadData = async () => {
    dispatch(getTaskHistoryListThunk({ taskId: props.taskId }));
  };

  useEffect(() => {
    loadData();
  }, []);
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
                apiData={filterTaskData}
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
            ></div>
          ) : (
            <div className="row clearfix g-3">
              <div className="col-sm-12">
                {filterTaskData && (
                  <DataTable
                    columns={columns}
                    data={filterTaskData}
                    defaultSortField="title"
                    pagination
                    selectableRows={false}
                    progressPending={isLoading?.getTaskHistoryList}
                    progressComponent={<TableLoadingSkelton />}
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
