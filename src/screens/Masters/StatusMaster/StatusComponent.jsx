import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import StatusService from '../../../services/MastersService/StatusService';
import PageHeader from '../../../components/Common/PageHeader';
import { useDispatch, useSelector } from 'react-redux';
import {
  getStatusData,
  postStatusData,
  updateStatusData,
  getGridStatusData
} from './StatusComponentAction';

import { getRoles } from '../../Dashboard/DashboardAction';
import { handleModalClose, handleModalOpen } from './StatusComponentSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { CustomValidation } from '../../../components/custom/CustomValidation/CustomValidation';
import { errorHandler } from '../../../utils';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';

function StatusComponent() {
  const dispatch = useDispatch();
  const statusData = useSelector(
    (statusMasterSlice) => statusMasterSlice.statusMaster.filterStatusData
  );
  const isLoading = useSelector(
    (statusMasterSlice) => statusMasterSlice.statusMaster.isLoading.statusData
  );

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id === 11)
  );
  const modal = useSelector(
    (statusMasterSlice) => statusMasterSlice.statusMaster.modal
  );

  const [reset, setReset] = useState(false);
  const clearFilters = () => {
    setReset(true);
  };

  const columns = [
    {
      accessorKey: 'action',
      header: 'Action',
      size: 110,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
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
                  modalData: row?.original,
                  modalHeader: 'Edit Status'
                })
              );
            }}
          >
            <i className="icofont-edit text-success" />
          </button>
        </div>
      )
    },
    {
      accessorKey: 'counter',
      header: 'Sr',
      size: 120,
      enableColumnFilter: false
    },
    {
      accessorFn: (originalRow) => originalRow.status || '--',
      header: 'Status Name',
      size: 200,
      muiTableBodyCellProps: () => ({
        sx: {
          color: '#f19828',
          fontWeight: 400
        }
      })
    },
    {
      header: 'Status',
      size: 160,
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
      accessorFn: (originalRow) => new Date(originalRow.created_at),
      header: 'Created At',
      filterVariant: 'date-range',
      Cell: ({ cell }) =>
        `${cell.getValue().toLocaleDateString()} ${cell
          .getValue()
          .toLocaleTimeString()}`
    },
    {
      accessorFn: (originalRow) => originalRow?.created_by?.trim() || '--',
      header: 'Created By',
      size: 180
    },
    {
      accessorFn: (originalRow) => new Date(originalRow.updated_at) || '--',
      header: 'Updated At',
      filterVariant: 'date-range',
      Cell: ({ cell }) =>
        `${cell.getValue().toLocaleDateString()} ${cell
          .getValue()
          .toLocaleTimeString()}`
    },
    {
      accessorFn: (originalRow) => originalRow?.updated_by?.trim() || '--',
      header: 'Updated By',
      size: 190
    }
  ];
  const initialValues = {
    status: modal.modalData ? modal.modalData.status : '',
    remark: modal?.modalData?.remark || '',
    is_active: String(modal?.modalData?.is_active) ?? '1'
  };

  const fields = [
    {
      name: 'status',
      label: 'Status name',
      max: 100,
      required: true,
      alphaNumeric: true
    },
    {
      name: 'remark',
      label: 'Remark',
      max: 255,
      required: false,
      alphaNumeric: true
    }
  ];

  const validationSchema = CustomValidation(fields);

  const handleForm = async (values, id, { setSubmitting }) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append('status', values.status);
    formData.append('remark', values.remark);

    const editformdata = new FormData();
    editformdata.append('status', values.status);
    editformdata.append('remark', values.remark);
    editformdata.append('is_active', values.is_active);

    try {
      if (!id) {
        await dispatch(postStatusData(formData));
        setTimeout(() => {
          dispatch(getGridStatusData());
          clearFilters();
        }, 500);
      } else {
        await dispatch(updateStatusData({ id: id, payload: editformdata }));

        setTimeout(() => {
          dispatch(getGridStatusData());
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
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  useEffect(() => {
    dispatch(getGridStatusData());

    if (!statusData.length) {
      dispatch(getRoles());
    }
  }, [dispatch, statusData.length]);

  const exportDataKeys = {
    status: 'Status Name',
    is_active: 'Status',
    remark: 'Remark',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Status Master Record'
  };
  return (
    <div className="container-xxl">
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

      <div className="card mt-2">
        {statusData && (
          <MaterialTable
            exportDataKeys={exportDataKeys}
            isLoading={isLoading}
            data={statusData}
            columns={columns}
            reset={reset}
            setReset={setReset}
          />
        )}
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
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleForm(values, modal.modalData ? modal.modalData.id : '', {
              setSubmitting
            });
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title className="fw-bold">
                  {modal.modalHeader}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="deadline-form">
                  <div className="row g-3 mb-3">
                    <div className="col-sm-12">
                      <label className="form-label font-weight-bold">
                        Status Name :<span style={{ color: 'red' }}>*</span>
                      </label>
                      <Field
                        type="text"
                        className="form-control form-control-sm"
                        name="status"
                      />
                      <ErrorMessage
                        name="status"
                        component="small"
                        className="text-danger"
                      />
                    </div>
                    <div className="col-sm-12">
                      <label className="form-label font-weight-bold">
                        Remark :
                      </label>
                      <Field
                        type="text"
                        className="form-control form-control-sm"
                        name="remark"
                      />
                      <ErrorMessage
                        name="remark"
                        component="small"
                        className="text-danger"
                      />
                    </div>
                    {modal.modalData && (
                      <div className="col-sm-12">
                        <label className="form-label font-weight-bold">
                          Status :<span style={{ color: 'red' }}>*</span>
                        </label>
                        <div className="row">
                          <div className="col-md-2">
                            <div className="form-check">
                              <Field
                                className="form-check-input"
                                type="radio"
                                name="is_active"
                                value="1"
                              />
                              <label className="form-check-label">Active</label>
                            </div>
                          </div>
                          <div className="col-md-1">
                            <div className="form-check">
                              <Field
                                className="form-check-input"
                                type="radio"
                                name="is_active"
                                value="0"
                                disabled={!modal.modalData}
                              />
                              <label className="form-check-label">
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
                {!modal.modalData ? (
                  <button
                    disabled={isSubmitting}
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
                ) : (
                  checkRole &&
                  checkRole[0]?.can_update === 1 && (
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="btn btn-primary text-white"
                      style={{ backgroundColor: '#484C7F' }}
                    >
                      Update
                    </button>
                  )
                )}
                <button
                  type="button"
                  className="btn btn-danger text-white"
                  onClick={() =>
                    dispatch(
                      handleModalClose({
                        showModal: false,
                        modalData: '',
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

function StatusDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new StatusService()
      .getStatus()
      .then((res) => {
        if (res?.status === 200) {
          const data = res?.data?.data;
          let counter = 1;
          for (const key in data) {
            if (data[key].is_active === 1) {
              tempData.push({
                counter: counter++,
                id: data[key].id,
                status: data[key].status
              });
            }
          }
          setData(tempData);
        }
      })
      .catch((error) => errorHandler(error));
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

export { StatusComponent, StatusDropdown };
