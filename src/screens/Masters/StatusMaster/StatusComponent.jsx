import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

import StatusService from '../../../services/MastersService/StatusService';
import PageHeader from '../../../components/Common/PageHeader';

import { Astrick } from '../../../components/Utilities/Style';
import * as Validation from '../../../components/Utilities/Validation';
import Alert from '../../../components/Common/Alert';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';

import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  getStatusData,
  postStatusData,
  updateStatusData
} from './StatusComponentAction';
import { statusMasterSlice } from './StatusComponentSlice';
import { getRoles } from '../../Dashboard/DashboardAction';
import { handleModalClose, handleModalOpen } from './StatusComponentSlice';
import { DashbordSlice } from '../../Dashboard/DashbordSlice';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';

function StatusComponent() {
  const dispatch = useDispatch();
  const statusData = useSelector(
    (statusMasterSlice) => statusMasterSlice.statusMaster.filterStatusData
  );
  const isLoading = useSelector(
    (statusMasterSlice) => statusMasterSlice.statusMaster.isLoading.statusData
  );

  const exportData = useSelector(
    (statusMasterSlice) => statusMasterSlice.statusMaster.exportStatusData
  );
  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id == 11)
  );
  const modal = useSelector(
    (statusMasterSlice) => statusMasterSlice.statusMaster.modal
  );
  const notify = useSelector(
    (statusMasterSlice) => statusMasterSlice.statusMaster.notify
  );

  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const roleId = localStorage.getItem('role_id');

  const searchRef = useRef();

  function SearchInputData(data, search) {
    const lowercaseSearch = search.toLowerCase();

    return data.filter((d) => {
      for (const key in d) {
        if (
          typeof d[key] === 'string' &&
          d[key].toLowerCase().includes(lowercaseSearch)
        ) {
          return true;
        }
      }
      return false;
    });
  }

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value) => {};

  const columns = [
    {
      name: 'Action',
      selector: (row) => {},
      sortable: false,
      width: '80px',
      cell: (row) => (
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#edit"
            onClick={(e) => {
              dispatch(
                handleModalOpen({
                  showModal: true,
                  modalData: row,
                  modalHeader: 'Edit Status'
                })
              );
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
        </div>
      )
    },
    {
      name: 'Sr',
      selector: (row) => row.counter,
      sortable: true,
      width: '60px'
    },
    {
      name: 'Status Name',
      selector: (row) => row.status,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: true,
      width: '150px',
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
      )
    },
    {
      name: 'Created At',
      selector: (row) => row.created_at,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Created By',
      selector: (row) => row.created_by,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Updated At',
      selector: (row) => row.updated_at,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Updated By',
      selector: (row) => row.updated_by,
      sortable: true,
      width: '175px'
    }
  ];

  const loadData = async () => {};

  const handleForm = (id) => async (e) => {
    e.preventDefault();
    // setNotify(null);
    const form = new FormData(e.target);
    if (!id) {
      dispatch(postStatusData(form));
      dispatch(getStatusData());
    } else {
      dispatch(updateStatusData({ id: id, payload: form }));
      dispatch(getStatusData());
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  useEffect(() => {
    loadData();
    dispatch(getStatusData());

    if (!statusData.length) {
      dispatch(getRoles());
    }
  }, []);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <PageHeader
        headerTitle="Status Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <button
                  className="btn btn-dark btn-set-task w-sm-100"
                  onClick={() => {
                    dispatch(
                      handleModalOpen({
                        showModal: true,
                        modalData: null,
                        modalHeader: 'Add Status'
                      })
                    );
                  }}
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Status
                </button>
              ) : (
                ''
              )}
            </div>
          );
        }}
      />

      <div className="card card-body">
        <div className="row">
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              placeholder="Search By Status Name...."
              ref={searchRef}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-sm btn-warning text-white"
              type="button"
              value={searchTerm}
              onClick={() => handleSearch(searchTerm)}
              style={{ marginTop: '0px', fontWeight: '600' }}
            >
              <i className="icofont-search-1 "></i> Search
            </button>
            <button
              className="btn btn-sm btn-info text-white"
              type="button"
              onClick={() => window.location.reload(false)}
              style={{ marginTop: '0px', fontWeight: '600' }}
            >
              <i className="icofont-refresh text-white"></i> Reset
            </button>
            <ExportToExcel
              className="btn btn-sm btn-danger"
              apiData={exportData}
              fileName="Status master Records"
            />
          </div>
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {statusData && (
                <DataTable
                  columns={columns}
                  // data={statusData}

                  data={statusData.filter((customer) => {
                    if (typeof searchTerm === 'string') {
                      if (typeof customer === 'string') {
                        return customer
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase());
                      } else if (typeof customer === 'object') {
                        return Object.values(customer).some(
                          (value) =>
                            typeof value === 'string' &&
                            value
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        );
                      }
                    }
                    return false;
                  })}
                  defaultSortField="title"
                  pagination
                  selectableRows={false}
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                  progressPending={isLoading}
                  progressComponent={<TableLoadingSkelton />}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        centered
        show={modal.showModal}
        onHide={(e) => {
          dispatch(
            handleModalClose({
              showModal: false,
              modalData: '',
              modalHeader: ''
            })
          );
        }}
      >
        <form
          method="post"
          onSubmit={handleForm(modal.modalData ? modal.modalData.id : '')}
        >
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="deadline-form">
              <div className="row g-3 mb-3">
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Status Name :<Astrick color="red" size="13px" />
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="status"
                    name="status"
                    required
                    maxLength={30}
                    defaultValue={modal.modalData ? modal.modalData.status : ''}
                    onKeyPress={(e) => {
                      Validation.CharacterWithSpace(e);
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                    onCopy={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                  />
                </div>
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Remark :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="remark"
                    name="remark"
                    maxLength={50}
                    defaultValue={modal.modalData ? modal.modalData.remark : ''}
                  />
                </div>
                {modal.modalData && (
                  <div className="col-sm-12">
                    <label className="form-label font-weight-bold">
                      Status :<Astrick color="red" size="13px" />
                    </label>
                    <div className="row">
                      <div className="col-md-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="is_active"
                            id="is_active_1"
                            value="1"
                            defaultChecked={
                              modal.modalData && modal.modalData.is_active === 1
                                ? true
                                : !modal.modalData
                                ? true
                                : false
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="is_active_1"
                          >
                            Active
                          </label>
                        </div>
                      </div>
                      <div className="col-md-1">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="is_active"
                            id="is_active_0"
                            value="0"
                            readOnly={modal.modalData ? false : true}
                            defaultChecked={
                              modal.modalData && modal.modalData.is_active === 0
                                ? true
                                : false
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="is_active_0"
                          >
                            Deactive
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {!modal.modalData && (
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{
                  backgroundColor: '#484C7F',
                  width: '80px',
                  padding: '8px'
                }}
              >
                Add
              </button>
            )}
            {modal.modalData && checkRole && checkRole[0]?.can_update === 1 ? (
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{ backgroundColor: '#484C7F' }}
              >
                Update
              </button>
            ) : (
              ''
            )}
            <button
              type="button"
              className="btn btn-danger text-white"
              onClick={() => {
                dispatch(
                  handleModalClose({
                    showModal: false,
                    modalData: '',
                    modalHeader: ''
                  })
                );
              }}
            >
              Cancel
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default StatusComponent;

export function StatusDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new StatusService().getStatus().then((res) => {
      if (res.status == 200) {
        const data = res.data.data;
        let counter = 1;
        for (const key in data) {
          if (data[key].is_active == 1) {
            tempData.push({
              counter: counter++,
              id: data[key].id,
              status: data[key].status
            });
          }
        }
        setData(tempData);
      }
    });
  }, []);

  return (
    <>
      {data && (
        <select
          className="form-control form-control-sm"
          id={props.id}
          name={props.name}
          onChange={props.getChangeValue}
          required={props.required ? true : false}
          readonly={props.readonly ? true : false}
          disabled={props.disabled ? true : false}
        >
          {props.defaultValue === 0 && (
            <option value="" selected>
              Select Status
            </option>
          )}
          {props.defaultValue !== 0 && <option value="">Select Status</option>}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue === item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.status}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.status}
                </option>
              );
            }
          })}
        </select>
      )}
      {!data && <p> Loading....</p>}
    </>
  );
}
