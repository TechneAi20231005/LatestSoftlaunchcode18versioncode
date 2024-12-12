import React, { useCallback, useEffect, useState } from 'react';
import { Container, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

import DesignationService from '../../../services/MastersService/DesignationService';

import PageHeader from '../../../components/Common/PageHeader';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Alert from '../../../components/Common/Alert';

import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';
import {
  getDesignationDataListThunk,
  postDesignationData,
  updatedDesignationData
} from './DesignationAction';
import { handleModalClose, handleModalOpen } from './DesignationSlice';

import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';
import { CustomValidation } from '../../../components/custom/CustomValidation/CustomValidation';

function DesignationComponent() {
  //initial state
  const dispatch = useDispatch();

  //redux state
  const { getDesignationData, exportDesignation, modal, notify } = useSelector(
    (state) => state.designationMaster
  );

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice?.dashboard?.getRoles?.filter((d) => d.menu_id === 8)
  );

  const isLoading = useSelector(
    (DesignationSlice) =>
      DesignationSlice.designationMaster.isLoading.DesignationList
  );

  //local state
  const [searchTerm, setSearchTerm] = useState('');

  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = useCallback(() => {
    const filteredList = customSearchHandler(getDesignationData, searchTerm);
    setFilteredData(filteredList);
  }, [getDesignationData, searchTerm]);

  // Function to handle reset button click
  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(getDesignationData);
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
                  modalHeader: 'Edit Designation'
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
      width: '80px'
    },
    {
      name: 'Designation',
      selector: (row) => row.designation,
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
      name: 'designation',
      label: 'Designation name',
      max: 31,
      min: 3,
      required: true,
      alphaNumeric: true
    },
    {
      name: 'remark',
      label: 'Remark',
      max: 1000,
      required: false,
      alphaNumeric: false
    }
  ];

  const validationSchema = CustomValidation(fields);
  const loadData = async () => {};

  const handleForm = async (values, id) => {
    const formData = new FormData();
    formData.append('designation', values.designation);
    formData.append('remark', values.remark);

    const editformdata = new FormData();
    editformdata.append('designation', values.designation);
    editformdata.append('remark', values.remark);
    editformdata.append('is_active', values.is_active);

    if (!id) {
      dispatch(postDesignationData(formData));
      setTimeout(() => {
        dispatch(getDesignationDataListThunk());
      }, 500);
    } else {
      dispatch(updatedDesignationData({ id: id, payload: editformdata }));

      setTimeout(() => {
        dispatch(getDesignationDataListThunk());
      }, 500);
    }
  };

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  useEffect(() => {
    dispatch(getDesignationDataListThunk());

    if (!getDesignationData.length) {
      dispatch(getRoles());
    }
  }, [dispatch, getDesignationData.length]);
  useEffect(() => {
    setFilteredData(getDesignationData);
  }, [getDesignationData]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, handleSearch]);

  const initialValues = {
    designation: modal.modalData?.designation || '',
    remark: modal.modalData?.remark || '',
    is_active: modal.modalData?.is_active
      ? String(modal.modalData.is_active)
      : '1'
  };

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <Container fluid>
        <PageHeader
          headerTitle="Designation Master"
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
                          modalHeader: 'Add Designation'
                        })
                      );
                    }}
                  >
                    <i className="icofont-plus-circle me-2 fs-6"></i>Add
                    Designation
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
          placeholder="Search by designation name...."
          exportFileName="Designation Master Record"
          exportData={exportDesignation}
          showExportButton={true}
        />

        <div className="card mt-2">
          {getDesignationData && (
            <DataTable
              columns={columns}
              data={filteredData}
              defaultSortField="title"
              pagination
              selectableRows={false}
              progressPending={isLoading}
              progressComponent={<TableLoadingSkelton />}
              className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
              highlightOnHover={true}
            />
          )}
        </div>
      </Container>
      <Modal centered show={modal.showModal}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleForm(values, modal.modalData ? modal.modalData.id : '');
          }}
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
                        Designation Name:{' '}
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Field
                        type="text"
                        name="designation"
                        id="designation"
                        className="form-control form-control-sm"
                      />
                      <ErrorMessage
                        name="designation"
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
                        id="remark"
                        name="remark"
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
                          component="small"
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

function DesignationDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];

    new DesignationService().getDesignation().then((res) => {
      if (res.status === 200) {
        const data = res.data.data;
        for (const key in data) {
          tempData.push({
            id: data[key].id,
            designation: data[key].designation
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
              Select Designation
            </option>
          )}
          {props.defaultValue !== 0 && (
            <option value={0}>Select Designation</option>
          )}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue === item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.designation}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.designation}
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

export { DesignationComponent, DesignationDropdown };
