import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';
import RoleService from '../../../services/MastersService/RoleService';
import PageHeader from '../../../components/Common/PageHeader';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import { useDispatch, useSelector } from 'react-redux';

import { getRoleData, updatedRole } from './RoleMasterAction';
import { getRoles } from '../../Dashboard/DashboardAction';
import { postRole } from './RoleMasterAction';
import { handleModalOpen, handleModalClose } from './RoleMasterSlice';

import { CustomValidation } from '../../../../src/components/custom/CustomValidation/CustomValidation';
import { errorHandler } from '../../../utils';
import moment from 'moment';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
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

  const modal = useSelector(
    (RoleMasterSlice) => RoleMasterSlice.rolemaster.modal
  );

  //Local state
  const [reset, setReset] = useState(false);

  //search function

  const clearFilters = () => {
    setReset(true);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'action',
        header: 'Action',
        size: 160,
        enableColumnOrdering: false,
        enableGrouping: false,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
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
                      modalData: row?.original,
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
                to={`/${_base}/MenuManage/` + row?.original?.id}
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
        accessorKey: 'counter',
        header: 'Sr',
        size: 90,
        enableColumnOrdering: false,
        enableGrouping: false,
        enableColumnFilter: false
      },
      {
        accessorKey: 'role',
        header: 'Role',
        size: 130,
        filterVariant: 'autocomplete',
        muiTableBodyCellProps: () => ({
          sx: {
            color: '#f19828',
            fontWeight: 400
          }
        })
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
        accessorKey: 'created_at',
        header: 'Created At',
        filterVariant: 'date-range',
        accessorFn: (row) => new Date(row.created_at),
        Cell: ({ row }) =>
          row.original.created_at
            ? moment(row.original.created_at).format('MM/DD/YYYY HH:mm:ss')
            : '--',
        size: 350
      },
      {
        accessorFn: (originalRow) => originalRow.created_by?.trim() || '--',
        header: 'Created By',
        size: 180
      },
      {
        accessorKey: 'updated_at',
        header: 'Updated At',
        filterVariant: 'date-range',
        accessorFn: (row) => new Date(row.updated_at),
        Cell: ({ row }) =>
          row?.original?.updated_at?.trim()
            ? moment(row.original.updated_at).format('MM/DD/YYYY HH:mm:ss')
            : '--'
      },
      {
        accessorFn: (originalRow) => originalRow?.updated_by?.trim() || '--',
        header: 'Updated By',
        size: 190
      }
    ],
    [checkRole, dispatch]
  );

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
      max: 255,
      required: false,
      alphaNumeric: false
    }
  ];

  const exportDataKeys = {
    role: 'Role',
    remark: 'Remark',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Role Master Record'
  };
  const validationSchema = CustomValidation(fields);

  const initialValues = {
    role: modal.modalData?.role || '',
    remark: modal.modalData?.remark || '',
    is_active: String(modal.modalData?.is_active) ?? '1'
  };

  const handleForm = async (values, id, { setSubmitting }) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append('role', values.role);
    formData.append('remark', values.remark);

    const editformdata = new FormData();
    editformdata.append('role', values.role);
    editformdata.append('remark', values.remark);
    editformdata.append('is_active', values.is_active);
    try {
      if (!id) {
        await dispatch(postRole(formData));
        setTimeout(() => {
          dispatch(getRoleData());
          clearFilters();
        }, 500);
      } else {
        await dispatch(updatedRole({ id: id, payload: editformdata }));
        setTimeout(() => {
          dispatch(getRoleData());
          clearFilters();
        }, 500);
      }
    } catch (error) {
      errorHandler(error);
      clearFilters();
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const storedAlert = localStorage.getItem('alert');
    if (storedAlert) {
      localStorage.removeItem('alert');
    } else if (location && location.state && location.state.alert) {
      localStorage.setItem('alert', location.state.alert);
    }
  }, [location]);

  useEffect(() => {
    dispatch(getRoleData());

    if (!RoleMasterData.length) {
      dispatch(getRoles());
    }
  }, [dispatch, RoleMasterData.length]);

  return (
    <div className="container-xxl">
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

      <div className="card mt-2">
        {RoleMasterData && (
          <MaterialTable
            columns={columns}
            data={RoleMasterData}
            isLoading={isLoading}
            reset={reset}
            setReset={setReset}
            exportDataKeys={exportDataKeys}
          />
        )}
      </div>

      <Modal centered show={modal.showModal}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(value, { setSubmitting }) =>
            handleForm(value, modal.modalData ? modal.modalData.id : '', {
              setSubmitting
            })
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
                    <div className="col-sm-12">
                      <label className="form-label font-weight-bold">
                        Role Name: <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Field
                        type="text"
                        name="role"
                        id="role"
                        className="form-control form-control-sm"
                      />
                      <ErrorMessage
                        name="role"
                        component="small"
                        className="text-danger small"
                      />
                    </div>

                    <div className="col-sm-12">
                      <label className="form-label font-weight-bold">
                        Remark:
                      </label>
                      <Field
                        type="text"
                        name="remark"
                        id="remark"
                        className="form-control form-control-sm"
                      />
                      <ErrorMessage
                        name="remark"
                        component="small"
                        className="text-danger small"
                      />
                    </div>

                    {modal.modalData && (
                      <div className="col-sm-12">
                        <label className="form-label font-weight-bold">
                          Status: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <div className="row">
                          <div className="col-md-2">
                            <label className="form-check">
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
                            <label className="form-check">
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
                          component="small"
                          className="text-danger small"
                        />
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
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                )}

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
    new RoleService()
      .getRole()
      .then((res) => {
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
      })
      .catch((error) => {
        errorHandler(error);
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
