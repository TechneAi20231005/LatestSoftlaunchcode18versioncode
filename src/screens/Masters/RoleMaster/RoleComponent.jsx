import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

import RoleService from '../../../services/MastersService/RoleService';
import PageHeader from '../../../components/Common/PageHeader';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Alert from '../../../components/Common/Alert';
import { Link } from 'react-router-dom';
import { _base } from '../../../settings/constants';

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
import { CustomValidation } from '../../../../src/components/custom/CustomValidation/CustomValidation';
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
  // const [notify, setNotify] = useState();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = useCallback(() => {
    const filteredList = customSearchHandler(RoleMasterData, searchTerm);
    setFilteredData(filteredList);
  }, [RoleMasterData, searchTerm]);

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
          {checkRole && checkRole[0]?.can_update === 1 ? (
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
          {checkRole && checkRole[0]?.can_create === 1 ? (
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
          {row.is_active === 1 && (
            <span className="badge bg-primary" style={{ width: '4rem' }}>
              Active
            </span>
          )}
          {row.is_active === 0 && (
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

  const fields = [
    {
      name: 'role',
      label: 'Role name',
      max: 100,
      required: true,
      alphaNumeric: true
    },
    {
      name: 'remark',
      label: 'Remark',
      max: 1000,
      required: false,
      alphaNumeric: true
    }
  ];

  const validationSchema = CustomValidation(fields);

  const initialValues = {
    role: modal.modalData?.role || '',
    remark: modal.modalData?.remark || '',
    is_active: modal.modalData?.is_active
      ? String(modal.modalData.is_active)
      : '1'
  };

  const handleForm = async (values, id) => {
    const formData = new FormData();
    formData.append('role', values.role);
    formData.append('remark', values.remark);

    const editformdata = new FormData();
    editformdata.append('role', values.role);
    editformdata.append('remark', values.remark);
    editformdata.append('is_active', values.is_active);

    if (!id) {
      dispatch(postRole(formData));
      setTimeout(() => {
        dispatch(getRoleData());
      }, 500);
    } else {
      dispatch(updatedRole({ id: id, payload: editformdata }));
      setTimeout(() => {
        dispatch(getRoleData());
      }, 500);
    }
  };

  useEffect(() => {
    const storedAlert = localStorage.getItem('alert');
    if (storedAlert) {
      // setNotify(storedAlert);

      localStorage.removeItem('alert');
    } else if (location && location.state && location.state.alert) {
      // setNotify(location.state.alert);
      localStorage.setItem('alert', location.state.alert);
    }
  }, [location]);

  useEffect(() => {
    dispatch(getRoleData());

    if (!RoleMasterData.length) {
      dispatch(getRoles());
    }
  }, [dispatch, RoleMasterData.length]);

  useEffect(() => {
    setFilteredData(RoleMasterData);
  }, [RoleMasterData]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, handleSearch]);

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

      <Modal centered show={modal.showModal}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(value) =>
            handleForm(value, modal.modalData ? modal.modalData.id : '')
          }
        >
          {({ isSubmitting }) => (
            <Form>
              <Modal.Header
                closeButton
                onClick={() =>
                  dispatch(
                    handleModalClose({
                      showModal: false,
                      modalData: null,
                      modalHeader: ''
                    })
                  )
                }
              >
                <Modal.Title className="fw-bold">
                  {modal.modalHeader}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="deadline-form">
                  <div className="row g-3 mb-3">
                    {/* Role Name */}
                    <div className="col-sm-12">
                      <label className="form-label font-weight-bold">
                        Role Name: <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Field
                        type="text"
                        name="role"
                        id="role"
                        className="form-control form-control-sm"
                        maxLength="25"
                      />
                      <ErrorMessage
                        name="role"
                        component="div"
                        className="text-danger small"
                      />
                    </div>

                    {/* Remark */}
                    <div className="col-sm-12">
                      <label className="form-label font-weight-bold">
                        Remark:
                      </label>
                      <Field
                        type="text"
                        name="remark"
                        id="remark"
                        className="form-control form-control-sm"
                        maxLength="50"
                      />
                      <ErrorMessage
                        name="remark"
                        component="div"
                        className="text-danger small"
                      />
                    </div>

                    {/* Status */}
                    {modal.modalData && (
                      <div className="col-sm-12">
                        <label className="form-label font-weight-bold">
                          Status: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <div className="row">
                          <div className="col-md-2">
                            <label className="form-check-label">
                              <Field
                                type="radio"
                                name="is_active"
                                id="is_active_1"
                                value="1"
                                className="form-check-input"
                              />
                              Active
                            </label>
                          </div>
                          <div className="col-md-2">
                            <label className="form-check-label">
                              <Field
                                type="radio"
                                name="is_active"
                                id="is_active_0"
                                value="0"
                                className="form-check-input"
                              />
                              Deactive
                            </label>
                          </div>
                        </div>
                        <ErrorMessage
                          name="is_active"
                          component="div"
                          className="text-danger small"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                {/* Submit Button */}
                {!modal.modalData && (
                  <button
                    type="submit"
                    className="btn btn-primary text-white"
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                )}

                {/* Update Button */}
                {modal.modalData &&
                  checkRole &&
                  checkRole[0]?.can_update === 1 && (
                    <button
                      type="submit"
                      className="btn btn-primary text-white"
                      disabled={isSubmitting}
                    >
                      Update
                    </button>
                  )}

                {/* Cancel Button */}
                <button
                  type="button"
                  className="btn btn-danger text-white"
                  onClick={() =>
                    dispatch(
                      handleModalClose({
                        showModal: false,
                        modalData: null,
                        modalHeader: ''
                      })
                    )
                  }
                >
                  Cancel
                </button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
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
          {props.defaultValue === 0 && (
            <option value={0} selected>
              Select Role
            </option>
          )}
          {props.defaultValue !== 0 && <option value={0}>Select Role</option>}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue === item.id) {
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
