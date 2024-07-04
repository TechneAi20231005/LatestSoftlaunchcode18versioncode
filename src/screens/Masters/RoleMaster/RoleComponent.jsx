import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

import RoleService from '../../../services/MastersService/RoleService';
import PageHeader from '../../../components/Common/PageHeader';

import { Astrick } from '../../../components/Utilities/Style';
import * as Validation from '../../../components/Utilities/Validation';
import Alert from '../../../components/Common/Alert';
import { Link } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useDispatch, useSelector } from 'react-redux';

import { getRoleData, updatedRole } from './RoleMasterAction';
import { getRoles } from '../../Dashboard/DashboardAction';
import { postRole } from './RoleMasterAction';
import { handleModalOpen, handleModalClose } from './RoleMasterSlice';

import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';

function RoleComponent({ location }) {
  //initial state
  const dispatch = useDispatch();

  //redux state

  const RoleMasterData = useSelector(
    (RoleMasterSlice) => RoleMasterSlice.rolemaster.getRoleData
  );
  const isLoading = useSelector(
    (RoleMasterSlice) => RoleMasterSlice.rolemaster.isLoading.RoleList
  );

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id === 10)
  );

  const Notify = useSelector(
    (RoleMasterSlice) => RoleMasterSlice.rolemaster.notify
  );
  const modal = useSelector(
    (RoleMasterSlice) => RoleMasterSlice.rolemaster.modal
  );
  const exportData = useSelector(
    (RoleMasterSlice) => RoleMasterSlice.rolemaster.exportRoleData
  );

  //Local state
  const [notify, setNotify] = useState();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = () => {
    const filteredList = customSearchHandler(RoleMasterData, searchTerm);
    setFilteredData(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(RoleMasterData);
  };

  const columns = [
    {
      name: 'Action',
      selector: (row) => {},
      sortable: false,
      width: '15%',
      cell: (row) => (
        <div className="btn-group-sm" role="group">
          {checkRole && checkRole[0]?.can_update == 1 ? (
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
                    modalHeader: 'Edit Role'
                  })
                );
              }}
            >
              <i className="icofont-edit text-success"></i>
            </button>
          ) : (
            ''
          )}
          {checkRole && checkRole[0]?.can_create == 1 ? (
            <Link
              to={`/${_base}/MenuManage/` + row.id}
              className="btn btn-primary"
              style={{
                maxWidth: '100%',
                fontSize: '0.75rem',
                borderRadius: '1rem'
              }}
            >
              Add Access
            </Link>
          ) : (
            ''
          )}
        </div>
      )
    },

    {
      name: 'Sr',
      width: '150px',
      selector: (row) => row.counter,
      sortable: true
    },
    {
      name: 'Role',
      id: 'role_id',
      width: '170px',
      sortable: true,
      selector: (row) => {},
      cell: (row) => (
        <div>
          <OverlayTrigger overlay={<Tooltip>{row.role} </Tooltip>}>
            <div>
              {/* <span className="ms-1"> {row.role}</span> */}
              <span>
                {row.role.length > 20
                  ? row.role.substring(0, 20) + '...'
                  : row.role}
              </span>
            </div>
          </OverlayTrigger>
        </div>
      )
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

  const handleForm = (id) => async (e) => {
    e.preventDefault();
    setNotify(null);
    const form = new FormData(e.target);

    if (!id) {
      dispatch(postRole(form)).then((res) => {
        if (res?.payload?.data?.status === 1) {
          dispatch(getRoleData());
        } else {
        }
      });
    } else {
      dispatch(updatedRole({ id: id, payload: form })).then((res) => {
        if (res?.payload?.data?.status === 1) {
          dispatch(getRoleData());
        } else {
        }
      });
    }
  };

  useEffect(() => {
    const storedAlert = localStorage.getItem('alert');
    if (storedAlert) {
      setNotify(storedAlert);

      localStorage.removeItem('alert');
    } else if (location && location.state && location.state.alert) {
      setNotify(location.state.alert);
      localStorage.setItem('alert', location.state.alert);
    }
  }, [location]);

  useEffect(() => {
    dispatch(getRoleData());

    if (!RoleMasterData.length) {
      dispatch(getRoles());
    }
  }, []);

  useEffect(() => {
    setFilteredData(RoleMasterData);
  }, [RoleMasterData]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  return (
    <div className="container-xxl">
      {Notify && <Alert alertData={Notify} />}
      <PageHeader
        headerTitle="Role Master"
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
                        modalHeader: 'Add Role'
                      })
                    );
                  }}
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Role
                </button>
              ) : (
                ''
              )}
            </div>
          );
        }}
      />

      <SearchBoxHeader
        showInput={true}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by role...."
        exportFileName="Role Master Record"
        exportData={exportData}
        showExportButton={true}
      />

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {RoleMasterData && (
                <DataTable
                  columns={columns}
                  data={filteredData}
                  defaultSortField="role_id"
                  pagination
                  selectableRows={false}
                  progressPending={isLoading}
                  progressComponent={<TableLoadingSkelton />}
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        centered
        show={modal.showModal}
        // onHide={(e) => {
        //   handleModal({
        //     showModal: false,
        //     modalData: "",
        //     modalHeader: "",
        //   });
        // }}
      >
        <form
          method="post"
          onSubmit={handleForm(modal.modalData ? modal.modalData.id : '')}
        >
          <Modal.Header
            closeButton
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
            <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="deadline-form">
              <div className="row g-3 mb-3">
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Role Name :<Astrick color="red" size="13px" />
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="role"
                    name="role"
                    maxLength={25}
                    required
                    defaultValue={modal.modalData ? modal.modalData.role : ''}
                    onKeyPress={(e) => {
                      Validation.CharactersNumbersOnly(e);
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

function RoleDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new RoleService().getRole().then((res) => {
      if (res.status === 200) {
        const data = res.data.data;
        let counter = 1;
        for (const key in data) {
          tempData.push({
            counter: counter++,
            id: data[key].id,
            role: data[key].role
          });
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
          value={props.defaultValue}
        >
          {props.defaultValue == 0 && (
            <option value={0} selected>
              Select Role
            </option>
          )}
          {props.defaultValue != 0 && <option value={0}>Select Role</option>}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue == item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.role}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.role}
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

export { RoleComponent, RoleDropdown };
