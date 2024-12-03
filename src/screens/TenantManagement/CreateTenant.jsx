import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { _base } from '../../settings/constants';

import PageHeader from '../../components/Common/PageHeader';

import Alert from '../../components/Common/Alert';
import { Astrick } from '../../components/Utilities/Style';
import * as Validation from '../../components/Utilities/Validation';
import Select from 'react-select';

import { useDispatch, useSelector } from 'react-redux';
import { getAllTenant } from './TenantConponentAction';

import {
  getCityData,
  getCountryDataSort,
  getRoles,
  getStateData,
  getStateDataSort
} from '../Dashboard/DashboardAction';

import { posttenantData } from './TenantConponentAction';
import { handleError } from './TenantComponentSlice';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { TenantValidation } from './Validation/TenantMasterValidation';
import { toast } from 'react-toastify';

export default function CreateTenant() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const stateDropdown = useSelector(
    (DashbordSlice) => DashbordSlice.dashboard.stateData
  );

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id === 33)
  );
  const CountryData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.filteredCountryData
  );

  const AllcityDropDownData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.cityData
  );

  const notify = useSelector(
    (TenantComponentSlice) => TenantComponentSlice.tenantMaster.notify
  );

  const isMasterAdmin = localStorage.getItem('role_name');
  const companyType = [
    { label: 'Private Limited Company', value: 'Private Limited Company' },
    { label: 'Public limited company', value: 'Public limited company' },
    {
      label: 'Limited liability partnership ',
      value: 'Limited liability partnership '
    },
    {
      label: 'Property management company',
      value: 'Property management company'
    },
    {
      label: 'Community Interest Company',
      value: 'Community Interest Company'
    }
  ];

  const state = null;

  const [stateDropdownData, setStateDropdownData] = useState(false);
  const [cityDropdownData, setCityDropdownData] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const initialValues = {
    company_name: '',
    series: '',
    company_type: '',
    email_id: '',
    contact_no: '',
    address: '',
    pincode: '',
    country_id: '',
    state_id: '',
    city_id: ''
  };

  const handleDependentChange = (e, type, setFieldValue) => {
    if (type === 'COUNTRY') {
      setStateDropdownData(
        stateDropdown
          .filter(
            (filterState) =>
              filterState.is_active === 1 && filterState.country_id === e.value
          )
          .map((d) => ({ value: d.id, label: d.state }))
      );

      setCityDropdownData([]);
    }

    if (type === 'STATE') {
      setCityDropdownData(
        AllcityDropDownData.filter(
          (filterState) =>
            filterState.is_active === 1 && filterState.state_id === e.value
        ).map((d) => ({ value: d.id, label: d.city }))
      );
    }
  };

  const [inputState, setInputState] = useState({});

  const handleContactValidation = (e) => {
    const contactValidation = e.target.value;

    if (contactValidation.length === 0) {
      setInputState({
        ...state,
        contactNoErr: ''
      });
      return;
    }
    if (
      contactValidation.charAt(0) === '9' ||
      contactValidation.charAt(0) === '8' ||
      contactValidation.charAt(0) === '7' ||
      contactValidation.charAt(0) === '6'
    ) {
      setInputState({ ...state, contactNoErr: '' });
    } else {
    }

    if (contactValidation.includes('000000000')) {
      setInputState({
        ...state,
        contactNoErr: 'System not accepting 9 Consecutive Zeros here.'
      });
    }

    if (contactValidation.length < 10) {
      if (contactValidation.length === 0) {
        setInputState({
          ...state,
          contactNoErr: 'please enter Mobile Number'
        });
      }
      setInputState({
        ...state,
        contactNoErr: 'Invalid Mobile Number'
      });
    }

    if (contactValidation.length < 11) {
    }
  };

  const loadData = useCallback(async () => {
    dispatch(getCountryDataSort());
    dispatch(getRoles());
    dispatch(getStateDataSort());
    dispatch(getCityData());
    dispatch(getStateData());
  }, [dispatch]);
  const handleForm = async (values) => {
    const formData = new FormData();

    formData.append('company_name', values.company_name);
    formData.append('series', values.series);
    formData.append('company_type', values.company_type);

    formData.append('email_id', values.email_id);
    formData.append('contact_no', values.contact_no);
    formData.append('address', values.address);
    formData.append('pincode', values.pincode);
    formData.append('country_id', values.country_id);
    formData.append('state_id', values.state_id);
    formData.append('city_id', values.city_id);

    dispatch(posttenantData(formData)).then((res) => {
      if (res?.payload?.data?.status === 1 && res?.payload?.status === 200) {
        navigate(`/${_base}/TenantMaster`);
        dispatch(getAllTenant());
        toast.success(res.payload.data.message, {
          autoClose: 10000 // 10 seconds in milliseconds
        });
      } else {
        toast.error(res.payload.data.message, {
          autoClose: 10000 // 10 seconds in milliseconds
        });
      }
    });
  };

  const handleKeyPress = (e) => {
    if (Validation.onlyCapitalLetter(e)) {
      setErrorMessage('');
    } else {
      setErrorMessage('Only capital letters are allowed');
    }
  };

  useEffect(() => {
    dispatch(handleError(null));
    if (isMasterAdmin !== 'MasterAdmin') {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
    loadData();
  }, [dispatch, loadData, isMasterAdmin]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_create === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      {notify?.type === 'danger' && (
        <>
          <Alert alertData={notify} />
        </>
      )}
      <PageHeader headerTitle="Add Tenant" />

      <Formik
        initialValues={initialValues}
        validationSchema={TenantValidation}
        onSubmit={(values) => {
          handleForm(values);
        }}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div className="card card-body">
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">
                  <b>
                    Tenant Name :<span style={{ color: 'red' }}>*</span>
                  </b>
                </label>
                <div className="col-sm-4">
                  <Field
                    type="text"
                    className="form-control form-control-sm"
                    id="company_name"
                    name="company_name"
                    placeholder="Company Name"
                  />
                  <ErrorMessage
                    name="company_name"
                    component="div"
                    style={{ color: 'red' }}
                  />
                </div>

                <label className="col-sm-2 col-form-label">
                  <b>
                    Ticket ID Series :<span style={{ color: 'red' }}>*</span>
                  </b>
                </label>
                <div className="col-sm-4">
                  <Field
                    type="text"
                    className="form-control form-control-sm"
                    id="series"
                    name="series"
                    placeholder="Enter Tenant Id Series"
                    maxLength={2}
                  />
                  <ErrorMessage
                    name="series"
                    component="div"
                    style={{ color: 'red' }}
                  />
                </div>
              </div>

              <div className="form-group row mt-2">
                <label className="col-sm-2 col-form-label">
                  <b>
                    Company Type :<span style={{ color: 'red' }}>*</span>
                  </b>
                </label>
                <div className="col-sm-8">
                  <div className="row">
                    <div className="col-sm-6">
                      <Field
                        name="company_type"
                        component={Select}
                        options={companyType}
                        value={companyType.find(
                          (option) => option.value === values.company_type
                        )}
                        onChange={(selectedOption) => {
                          setFieldValue(
                            'company_type',
                            selectedOption ? selectedOption.value : ''
                          );
                        }}
                      />

                      <ErrorMessage
                        name="company_type"
                        component="div"
                        style={{ color: 'red' }}
                      />
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <h5 className="text-danger">
                          <b>Important Note:</b>
                        </h5>
                        <ul>
                          <li>Enter two capital alphabets only.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group row mt-2">
                <label className="col-sm-2 col-form-label">
                  <b>
                    Email Address :<span style={{ color: 'red' }}>*</span>
                  </b>
                </label>
                <div className="col-sm-4">
                  <Field
                    type="text"
                    className="form-control form-control-sm"
                    id="email_id"
                    name="email_id"
                    placeholder="Email Address"
                  />
                  <ErrorMessage
                    name="email_id"
                    component="div"
                    style={{ color: 'red' }}
                  />
                </div>
              </div>

              <div className="form-group row mt-2">
                <label className="col-sm-2 col-form-label">
                  <b>
                    Contact Number :<span style={{ color: 'red' }}>*</span>
                  </b>
                </label>
                <div className="col-sm-4">
                  <Field
                    type="text"
                    className="form-control form-control-sm"
                    id="contact_no"
                    name="contact_no"
                    placeholder="Contact Number"
                  />
                  <ErrorMessage
                    name="contact_no"
                    component="div"
                    style={{ color: 'red' }}
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header bg-primary text-white p-2">
                <h5>Address Details</h5>
              </div>
              <div className="card-body">
                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>Address : </b>
                  </label>
                  <div className="col-sm-10">
                    <Field
                      as="textarea"
                      className="form-control form-control-sm"
                      id="address"
                      name="address"
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      style={{ color: 'red' }}
                    />
                  </div>
                </div>

                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>Pincode : </b>
                  </label>
                  <div className="col-sm-4">
                    <Field
                      type="text"
                      className="form-control form-control-sm"
                      id="pincode"
                      name="pincode"
                      minLength={6}
                      maxLength={6}
                    />
                    <ErrorMessage
                      name="pincode"
                      component="div"
                      style={{ color: 'red' }}
                    />
                  </div>

                  <label
                    className="col-sm-2 col-form-label"
                    style={{ textAlign: 'right' }}
                  >
                    <b>Country : </b>
                  </label>
                  <div className="col-sm-4">
                    <Field
                      name="country_id"
                      component={Select}
                      options={CountryData}
                      value={CountryData.find(
                        (option) => option.value === values.country_id
                      )}
                      onChange={(selectedOption) => {
                        setFieldValue(
                          'country_id',
                          selectedOption ? selectedOption.value : ''
                        );

                        handleDependentChange(
                          selectedOption,
                          'COUNTRY',
                          setFieldValue
                        );
                      }}
                    />

                    <ErrorMessage
                      name="country_id"
                      component="div"
                      style={{ color: 'red' }}
                    />
                  </div>
                </div>

                {/* State */}
                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>State : </b>
                  </label>
                  <div className="col-sm-4">
                    {stateDropdownData && (
                      <Field
                        name="state_id"
                        component={Select}
                        options={stateDropdownData}
                        value={
                          stateDropdownData &&
                          stateDropdownData?.find(
                            (option) => option.value === values?.state_id
                          )
                        }
                        onChange={(selectedOption) => {
                          setFieldValue(
                            'state_id',
                            selectedOption ? selectedOption.value : ''
                          );

                          handleDependentChange(
                            selectedOption,
                            'STATE',
                            setFieldValue
                          );
                        }}
                      />
                    )}

                    <ErrorMessage
                      name="state_id"
                      component="div"
                      style={{ color: 'red' }}
                    />
                  </div>

                  <label
                    className="col-sm-2 col-form-label"
                    style={{ textAlign: 'right' }}
                  >
                    <b>City : </b>
                  </label>
                  <div className="col-sm-4">
                    {cityDropdownData && (
                      <Field
                        name="city_id"
                        component={Select}
                        options={cityDropdownData}
                        value={
                          cityDropdownData &&
                          cityDropdownData?.find(
                            (option) => option.value === values?.city_id
                          )
                        } // Match selected value in options
                        onChange={(selectedOption) => {
                          // Ensure only the value is passed to Formik
                          setFieldValue(
                            'city_id',
                            selectedOption ? selectedOption.value : ''
                          );

                          // Handle dependent change for city
                          handleDependentChange(
                            selectedOption,
                            'CITY',
                            setFieldValue
                          );
                        }}
                      />
                    )}
                    <ErrorMessage
                      name="city_id"
                      component="div"
                      style={{ color: 'red' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer">
              <div className="mt-3" style={{ textAlign: 'right' }}>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
                <Link
                  to={`/${_base}/TenantMaster`}
                  className="btn btn-danger text-white"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
