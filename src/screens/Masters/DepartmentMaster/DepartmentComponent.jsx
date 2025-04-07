import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

import DepartmentService from '../../../services/MastersService/DepartmentService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import PageHeader from '../../../components/Common/PageHeader';

import { useDispatch, useSelector } from 'react-redux';
import {
  departmentData,
  postdepartment,
  updateDepartment
} from './DepartmentMasterAction';

import { getRoles } from '../../Dashboard/DashboardAction';
import { handleModalClose, handleModalOpen } from './DepartmentMasterSlice';
import { customSearchHandler } from '../../../utils/customFunction';
import { CustomValidation } from '../../../components/custom/CustomValidation/CustomValidation';
import { errorHandler } from '../../../utils';
import moment from 'moment';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';

function DepartmentComponent() {
  //initial state
  const dispatch = useDispatch();

  //Redux state
  const department = useSelector(
    (DepartmentMasterSlice) => DepartmentMasterSlice.department.departmentData
  );
  const isLoading = useSelector(
    (DepartmentMasterSlice) =>
      DepartmentMasterSlice.department.isLoading.departmentDataList
  );

  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 9)
  );
  const modal = useSelector(
    (DashboardSlice) => DashboardSlice.department.modal
  );
  const Notify = useSelector(
    (DepartmentMasterSlice) => DepartmentMasterSlice.department.notify
  );
  const exportData = useSelector(
    (DepartmentMasterSlice) =>
      DepartmentMasterSlice.department.exportDepartmentData
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [reset, setReset] = useState(false);
  //search function

  const handleSearch = useCallback(() => {
    const filteredList = customSearchHandler(department, searchTerm);
    setFilteredData(filteredList);
  }, [department, searchTerm]);

  // Function to handle reset button click
  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(department);
  };

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
                  modalHeader: 'Edit Department'
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
      accessorKey: 'counter',
      header: 'Sr',
      size: 90,
      enableColumnOrdering: false,
      enableGrouping: false
    },
    {
      accessorKey: 'department',
      header: 'Department',
      filterVariant: 'autocomplete',
      muiTableBodyCellProps: () => ({
        sx: {
          color: '#f19828',
          fontWeight: 400
        }
      }),
      size: 185
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
      header: 'Created At',
      accessorKey: 'created_at',
      filterVariant: 'date-range',
      accessorFn: (row) => new Date(row.created_at),
      Cell: ({ row }) =>
        moment(row.original.created_at).format('MM/DD/YYYY HH:mm:ss'),
      size: 350
    },
    {
      accessorKey: 'created_by',
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
      size: 185
    }
  ];

  const fields = [
    {
      name: 'department',
      label: 'Department name',
      max: 100,
      required: true,
      alphaNumeric: true
    },
    {
      name: 'remark',
      label: 'Remark',
      max: 255,
      required: false
    }
  ];

  const validationSchema = CustomValidation(fields);

  const initialValues = {
    department: modal.modalData?.department || '',
    remark: modal.modalData?.remark || '',
    is_active: String(modal.modalData?.is_active) ?? '1'
  };

  const handleForm = async (values, id, { setSubmitting }) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append('department', values.department);
    formData.append('remark', values.remark);

    const editformdata = new FormData();
    editformdata.append('department', values.department);
    editformdata.append('remark', values.remark);
    editformdata.append('is_active', values.is_active);
    try {
      if (!id) {
        await dispatch(postdepartment(formData));
        setTimeout(() => {
          dispatch(departmentData());
          clearFilters();
        }, 500);
      } else {
        await dispatch(updateDepartment({ id: id, payload: editformdata }));
        setTimeout(() => {
          dispatch(departmentData());
          clearFilters();
        }, 500);
      }
    } catch (eror) {
      errorHandler(eror);
      clearFilters();
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    dispatch(departmentData());
    if (!department.length) {
      dispatch(getRoles());
    }
  }, [dispatch, department.length]);

  useEffect(() => {
    setFilteredData(department);
  }, [department]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, handleSearch]);

  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Department Master"
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
                        modalHeader: 'Add Department'
                      })
                    );
                  }}
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add
                  Department
                </button>
              ) : (
                ''
              )}
            </div>
          );
        }}
      />

      {/*   <SearchBoxHeader
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by department name...."
        exportFileName="Department Master Record"
        exportData={exportData}
        showExportButton={true}
      />
 */}
      <div className="card mt-2">
        {department && (
          <MaterialTable
            data={filteredData}
            columns={columns}
            isLoading={isLoading}
            reset={reset}
            setReset={setReset}
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
                        Department Name: <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Field
                        type="text"
                        id="department"
                        name="department"
                        className="form-control form-control-sm"
                      />
                      <ErrorMessage
                        name="department"
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
                                value="0"
                                id="is_active_0"
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

function DepartmentDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new DepartmentService().getDepartment().then((res) => {
      if (res.status === 200) {
        const data = res.data.data;
        let counter = 1;
        for (const key in data) {
          tempData.push({
            counter: counter++,
            id: data[key].id,
            department: data[key].department
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
        >
          {props.defaultValue === 0 && (
            <option value="" selected>
              Select Department
            </option>
          )}
          {props.defaultValue !== 0 && (
            <option value="">Select Department</option>
          )}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue === item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.department}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.department}
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
export { DepartmentComponent, DepartmentDropdown };
