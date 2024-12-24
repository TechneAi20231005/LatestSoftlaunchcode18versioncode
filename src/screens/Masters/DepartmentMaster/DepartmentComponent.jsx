import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

import DepartmentService from '../../../services/MastersService/DepartmentService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import PageHeader from '../../../components/Common/PageHeader';
import Alert from '../../../components/Common/Alert';

import { useDispatch, useSelector } from 'react-redux';
import {
  departmentData,
  postdepartment,
  updateDepartment
} from './DepartmentMasterAction';

import { getRoles } from '../../Dashboard/DashboardAction';
import { handleModalClose, handleModalOpen } from './DepartmentMasterSlice';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';
import { CustomValidation } from '../../../components/custom/CustomValidation/CustomValidation';

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
      name: 'Sr',
      selector: (row) => row.counter,
      sortable: true,
      width: '60px'
    },
    {
      name: 'Department',
      selector: (row) => row.department,
      sortable: true,
      width: '175px'
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
      name: 'department',
      label: 'Department name',
      max: 100,
      required: true,
      alphaNumeric: true
    },
    {
      name: 'remark',
      label: 'Remark',
      max: 1000,
      required: false
    }
  ];

  const validationSchema = CustomValidation(fields);

  const initialValues = {
    department: modal.modalData?.department || '',
    remark: modal.modalData?.remark || '',
    is_active: String(modal.modalData?.is_active) ?? '1'
  };

  const handleForm = async (values, id) => {
    const formData = new FormData();
    formData.append('department', values.department);
    formData.append('remark', values.remark);

    const editformdata = new FormData();
    editformdata.append('department', values.department);
    editformdata.append('remark', values.remark);
    editformdata.append('is_active', values.is_active);

    if (!id) {
      dispatch(postdepartment(formData));
      setTimeout(() => {
        dispatch(departmentData());
      }, 500);
    } else {
      dispatch(updateDepartment({ id: id, payload: editformdata }));
      setTimeout(() => {
        dispatch(departmentData());
      }, 500);
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
      {Notify && <Alert alertData={Notify} />}

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

      <SearchBoxHeader
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by department name...."
        exportFileName="Department Master Record"
        exportData={exportData}
        showExportButton={true}
      />

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {department && (
                <DataTable
                  columns={columns}
                  data={filteredData}
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
