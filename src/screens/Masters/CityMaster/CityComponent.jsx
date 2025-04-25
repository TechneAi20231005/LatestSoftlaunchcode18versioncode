import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';

import { useSelector, useDispatch } from 'react-redux';

import CityService from '../../../services/MastersService/CityService';

import PageHeader from '../../../components/Common/PageHeader';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import {
  handleModalInStore,
  handleModalClose
} from '../../Dashboard/DashbordSlice';

import {
  getCityData,
  getCountryData,
  getCountryDataSort,
  getStateDataSort,
  postCityData,
  updateCityData
} from '../../Dashboard/DashboardAction';
import { getRoles } from '../../Dashboard/DashboardAction';
import { CustomValidation } from '../../../../src/components/custom/CustomValidation/CustomValidation';
import { errorHandler } from '../../../utils';
import moment from 'moment';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
function CityComponent() {
  // initial state

  const [reset, setReset] = useState(false);
  const dispatch = useDispatch();

  //redux state

  const {
    cityData,
    modal,
    filteredStateData,
    filteredCountryData,
    activeState
  } = useSelector((state) => state?.dashboard);
  const isLoading = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.isLoading.getCityDataList
  );
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.find((d) => d.menu_id === 7)
  );
  //local state
  const [stateDropdownData, setStateDropdownData] = useState([]);
  const [updateStatus, setUpdateStatus] = useState({});

  const clearFilters = () => {
    setReset(true);
  };
  const columns = useMemo(
    () => [
      {
        header: 'Action',
        accessorKey: 'action',
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
                  handleModalInStore({
                    showModal: true,
                    modalData: row?.original,
                    modalHeader: 'Edit City'
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
        enableGrouping: false,
        enableColumnFilter: false
      },
      {
        accessorKey: 'city',
        header: 'City',
        filterVariant: 'autocomplete',
        muiTableBodyCellProps: () => ({
          sx: {
            color: '#f19828',
            fontWeight: 400
          }
        }),
        size: 125
      },
      {
        accessorKey: 'state',
        header: 'State',
        size: 150
      },
      {
        accessorKey: 'country',
        header: 'Country',
        size: 175
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
        id: 'updated_by',
        accessorFn: (originalRow) => originalRow?.updated_by?.trim() || '--',
        header: 'Updated By',
        size: 185
      }
    ],
    [dispatch]
  );

  const fields = [
    {
      name: 'country_id',
      label: 'Country name',
      required: true,
      alphaNumeric: false
    },
    {
      name: 'state_id',
      label: 'State name',
      required: true,
      alphaNumeric: false
    },
    {
      name: 'city',
      label: 'City name',
      max: 100,
      min: 3,
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
  const exportDataKeys = {
    city: 'City',
    state: 'State',
    country: 'Country',
    remark: 'Remark',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'City Master Record'
  };

  const validationSchema = CustomValidation(fields);

  let valueof = modal.modalData
    ? filteredCountryData.find((d) => modal.modalData.country_id === d.value)
    : '';

  let stateValue = modal.modalData
    ? filteredStateData?.find((d) => modal.modalData.state_id === d.value)
    : '';

  const initialValues = {
    country_id: valueof?.value || '',
    state_id: stateValue?.value || '',
    city: modal.modalData?.city || '',
    remark: modal?.modalData?.remark || '',
    is_active: String(modal.modalData?.is_active) ?? '1'
  };

  const handleForm = async (values, id, { setSubmitting }) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append('country_id', values.country_id);
    formData.append('state_id', values.state_id);
    formData.append('city', values.city);
    formData.append('remark', values.remark);

    const editformdata = new FormData();
    editformdata.append('country_id', values.country_id);
    editformdata.append('state_id', values.state_id);
    editformdata.append('city', values.city);
    editformdata.append('remark', values.remark);
    editformdata.append('is_active', values.is_active);
    try {
      if (!id) {
        await dispatch(postCityData(formData));
        dispatch(getCityData());
      } else {
        await dispatch(updateCityData({ id: id, payload: editformdata }));
        dispatch(getCityData());
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setSubmitting(false);
      clearFilters();
    }
  };

  const handleCountryChange = (e) => {
    if (!e || Object.entries(e).length === 0) return;

    setStateDropdownData(
      activeState &&
        activeState
          ?.filter((filterState) => filterState.country_id === e.value)
          ?.map((d) => ({ value: d.id, label: d.state }))
    );
    const newStatus = { ...updateStatus, statedrp: 1 };
    setUpdateStatus(newStatus);
    // setStateName(null);
  };

  useEffect(() => {
    dispatch(getCityData());
    dispatch(getRoles());
    dispatch(getCountryData());
    dispatch(getStateDataSort());
    dispatch(getCountryDataSort());

    if (
      !cityData.length ||
      !checkRole ||
      !filteredStateData.length ||
      !filteredCountryData.length
    ) {
    }
  }, [
    dispatch,
    cityData.length,
    checkRole,
    filteredStateData.length,
    filteredCountryData.length
  ]);

  useEffect(() => {
    dispatch(getCityData());
  }, [dispatch]);

  useEffect(() => {
    if (checkRole && checkRole?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }

    if (modal.modalData) {
      if (modal.modalData.state_id) {
        // setStateName(
        //   activeState?.filter((d) => modal.modalData.state_id === d.value)
        // );
      }
    }
  }, [modal.showModal, checkRole, modal.modalData]);

  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="City Master"
        renderRight={() => {
          return (
            <div>
              {checkRole && checkRole?.can_create === 1 ? (
                <button
                  className="btn btn-dark px-5"
                  onClick={() => {
                    // setStateName(null);
                    dispatch(
                      handleModalInStore({
                        showModal: true,
                        modalData: null,
                        modalHeader: 'Add City'
                      })
                    );
                  }}
                >
                  <i className="icofont-plus me-2 fs-6" />
                  Add City
                </button>
              ) : (
                ''
              )}
            </div>
          );
        }}
      />
      <div className="mt-2">
        {cityData && (
          <MaterialTable
            columns={columns}
            data={cityData}
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
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <Modal.Header
                closeButton
                onClick={() =>
                  dispatch(
                    handleModalClose({
                      showModal: false,
                      modalData: null,
                      modalHeader: 'Add City'
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
                    {/* Select Country */}
                    <div className="col-sm-12">
                      <label className="form-label font-weight-bold">
                        Select Country: <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        classNamePrefix="react-select"
                        options={filteredCountryData}
                        id="country_id"
                        name="country_id"
                        isClearable={true}
                        onChange={(selectedOption) => {
                          setFieldValue('state_id', null);
                          setFieldValue('country_id', selectedOption?.value);
                          handleCountryChange(selectedOption);
                        }}
                        defaultValue={
                          modal.modalData
                            ? filteredCountryData.find(
                                (d) => modal.modalData.country_id === d.value
                              )
                            : ''
                        }
                        // value={values.country_id}
                      />
                      <ErrorMessage
                        name="country_id"
                        component="small"
                        className="text-danger small"
                      />
                    </div>

                    {/* Select State */}
                    <div className="col-sm-12">
                      <label className="form-label font-weight-bold">
                        Select State: <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        classNamePrefix="react-select"
                        options={stateDropdownData && stateDropdownData}
                        name="state_id"
                        id="state_id"
                        isClearable={true}
                        onChange={(selectedOption) =>
                          setFieldValue(
                            'state_id',
                            selectedOption?.value || null
                          )
                        }
                        defaultValue={
                          modal.modalData
                            ? filteredStateData?.find(
                                (d) => modal.modalData.state_id === d.value
                              )
                            : ''
                        }
                        value={
                          values.state_id
                            ? stateDropdownData?.find(
                                (item) => item.value === Number(values.state_id)
                              )
                            : null // Bind to Formik's state_id
                        }
                        // value={values.state_id}
                      />
                      <ErrorMessage
                        name="state_id"
                        component="small"
                        className="text-danger small"
                      />
                    </div>

                    {/* City Name */}
                    <div className="col-sm-12">
                      <label className="form-label font-weight-bold">
                        City Name: <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Field
                        type="text"
                        id="city"
                        name="city"
                        className="form-control form-control-sm"
                      />
                      <ErrorMessage
                        name="city"
                        component="small"
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
                      />
                      <ErrorMessage
                        name="remark"
                        component="small"
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
                            <div className="form-check">
                              <Field
                                className="form-check-input"
                                type="radio"
                                name="is_active"
                                id="is_active_1"
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
                                id="is_active_0"
                                value="0"
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
                  checkRole?.can_update === 1 && (
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
                        modalHeader: 'Add City'
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
function CityDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new CityService().getCity().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const data = res.data.data;
        for (const key in data) {
          if (data[key].is_active === 1) {
            tempData.push({
              counter: counter++,
              id: data[key].id,
              city: data[key].city
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
        >
          {props.defaultValue === 0 && (
            <option value={0} selected>
              Select City
            </option>
          )}
          {props.defaultValue !== 0 && <option value={0}>Select City</option>}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue === item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.city}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.city}
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

export { CityComponent, CityDropdown };
