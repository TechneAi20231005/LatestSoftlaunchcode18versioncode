import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

import CountryService from '../../../services/MastersService/CountryService';

import PageHeader from '../../../components/Common/PageHeader';

import { Astrick } from '../../../components/Utilities/Style';
import * as Validation from '../../../components/Utilities/Validation';
import Alert from '../../../components/Common/Alert';

import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import {
  getCountryData,
  getRoles,
  postCountryData,
  updateCountryData
} from '../../Dashboard/DashboardAction';
import {
  handleModalInStore,
  handleModalClose
} from '../../Dashboard/DashbordSlice';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';
import { CustomValidation } from '../../../components/custom/CustomValidation/CustomValidation';

function CountryComponent() {
  //initial state
  const dispatch = useDispatch();

  //redux state

  const { countryData, notify, modal, exportCountryData } = useSelector(
    (state) => state.dashboard
  );

  const isLoading = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.isLoading.CountyDataList
  );

  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 5)
  );

  //local state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = useCallback(() => {
    const filteredList = customSearchHandler(countryData, searchTerm);
    setFilteredData(filteredList);
  }, [countryData, searchTerm]);
  // Function to handle reset button click
  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(countryData);
  };

  const columns = [
    {
      name: 'Action',
      selector: (row) => {},
      sortable: false,
      width: '100px',
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#depedit"
            onClick={(e) => {
              dispatch(
                handleModalInStore({
                  showModal: true,
                  modalData: row,
                  modalHeader: 'Edit Country'
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
      name: 'Country',
      selector: (row) => row.country,
      sortable: true,
      width: '125px'
    },
    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: true,
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
      ),
      width: '100px'
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

  const handleForm = async (values, id) => {
    const formData = new FormData();
    formData.append('country', values.country);
    formData.append('remark', values.remark);

    const editformdata = new FormData();
    editformdata.append('country', values.country);
    editformdata.append('remark', values.remark);
    editformdata.append('is_active', values.is_active);

    if (!id) {
      dispatch(postCountryData(formData)).then((res) => {
        if (res?.payload?.data?.status === 1) {
          dispatch(getCountryData());
        } else {
        }
      });
    } else {
      dispatch(updateCountryData({ id: id, payload: editformdata })).then(
        (res) => {
          if (res?.payload?.data?.status === 1) {
            dispatch(getCountryData());
          } else {
          }
        }
      );
    }
  };

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  // useEffect(() => {
  //   dispatch(getCountryData());

  //   if (!countryData.length || !checkRole.length) {
  //     dispatch(getRoles());
  //   }
  // }, []);
  useEffect(() => {
    dispatch(getCountryData());

    if (!countryData.length || !checkRole.length) {
      dispatch(getRoles());
    }
  }, [dispatch, countryData.length, checkRole.length]);

  useEffect(() => {
    setFilteredData(countryData);
  }, [countryData]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, handleSearch]);

  const fields = [
    {
      name: 'country',
      label: 'Country name',
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

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader
        headerTitle="Country Master"
        renderRight={() => {
          return (
            <div>
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <button
                  className="btn btn-dark px-5"
                  onClick={() => {
                    dispatch(
                      handleModalInStore({
                        showModal: true,
                        modalData: null,
                        modalHeader: 'Add Country'
                      })
                    );
                  }}
                >
                  <i className="icofont-plus-circle fs-6" />
                  Add Country
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
        placeholder="Search by country name...."
        exportFileName="Country Master Record"
        exportData={exportCountryData}
        showExportButton={true}
      />

      <div className="mt-2">
        {countryData && (
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

      <Modal centered show={modal.showModal}>
        <Formik
          initialValues={{
            id: modal.modalData?.id || '',
            country: modal.modalData?.country || '',
            remark: modal.modalData?.remark || '',
            is_active:
              modal.modalData?.is_active !== undefined
                ? modal.modalData.is_active
                : 1
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleForm(values, modal.modalData ? modal.modalData.id : '');
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Modal.Header
                closeButton
                onClick={() => {
                  dispatch(
                    handleModalClose({
                      showModal: false,
                      modalData: null,
                      modalHeader: ''
                    })
                  );
                }}
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
                        Country Name :<Astrick color="red" size="13px" />
                      </label>
                      <Field
                        name="country"
                        type="text"
                        className="form-control form-control-sm"
                        id="country"
                        maxLength={25}
                        minLength={4}
                        defaultValue={
                          modal.modalData ? modal.modalData.country : ''
                        }
                        onKeyPress={(e) => {
                          Validation.CharacterWithSpace(e);
                        }}
                        // onPaste={(e) => {
                        //   e.preventDefault();
                        //   return false;
                        // }}
                        // onCopy={(e) => {
                        //   e.preventDefault();
                        //   return false;
                        // }}
                      />
                      {errors.country && touched.country ? (
                        <div className="text-danger">{errors.country}</div>
                      ) : null}
                    </div>
                    <div className="col-sm-12">
                      <label className="form-label font-weight-bold">
                        Remark :
                      </label>
                      <Field
                        name="remark"
                        type="text"
                        className="form-control form-control-sm"
                      />
                      {errors.remark && touched.remark ? (
                        <div className="text-danger">{errors.remark}</div>
                      ) : null}
                    </div>
                    {modal.modalData && (
                      <div className="col-sm-12">
                        <label className="form-label font-weight-bold">
                          Status :<Astrick color="red" size="13px" />
                        </label>
                        <div className="row">
                          <div className="col-md-2">
                            <label className="form-check">
                              <Field
                                id="is_active_1"
                                type="radio"
                                name="is_active"
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
                        {errors.is_active && touched.is_active ? (
                          <div className="text-danger">{errors.is_active}</div>
                        ) : null}
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
                {modal.modalData &&
                  checkRole &&
                  checkRole[0]?.can_update === 1 && (
                    <button
                      type="submit"
                      className="btn btn-primary text-white"
                      style={{ backgroundColor: '#484C7F' }}
                    >
                      Update
                    </button>
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
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
}

function CountryDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new CountryService().getCountry().then((res) => {
      if (res.status === 200) {
        const data = res.data.data;
        for (const key in data) {
          if (data[key].is_active === 1) {
            tempData.push({
              id: data[key].id,
              country: data[key].country
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
          id={props?.id}
          name={props?.name}
          onChange={props?.getChangeValue}
          required={props?.required ? true : false}
        >
          {props?.defaultValue === 0 && (
            <option value={0} selected>
              Select Country
            </option>
          )}
          {props?.defaultValue !== 0 && (
            <option value={0}>Select Country</option>
          )}
          {data.map(function (item, i) {
            if (props?.defaultValue && props?.defaultValue === item.id) {
              return (
                <option key={i} value={item?.id} selected>
                  {item?.country}
                </option>
              );
            } else {
              return (
                <option key={i} value={item?.id}>
                  {item?.country}
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

export { CountryComponent, CountryDropdown };
