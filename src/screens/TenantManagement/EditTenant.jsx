import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { _base } from '../../settings/constants';

import PageHeader from '../../components/Common/PageHeader';

import TenantService from '../../services/MastersService/TenantService';
import { Astrick } from '../../components/Utilities/Style';
import * as Validation from '../../components/Utilities/Validation';
import Select from 'react-select';

import Alert from '../../components/Common/Alert';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCityData,
  getCountryDataSort,
  getStateData,
  getStateDataSort
} from '../Dashboard/DashboardAction';
import { getRoles } from '../Dashboard/DashboardAction';
import { getAllTenant, updatetenantData } from './TenantConponentAction';
import { handleError } from './TenantComponentSlice';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { TenantValidation } from './Validation/TenantMasterValidation';
import { toast } from 'react-toastify';

export default function EditTenant() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id === 33)
  );
  const [data, setData] = useState();
  const [toggleRadio, setToggleRadio] = useState(false);
  const [clearFlag, setClearFlag] = useState(false);
  const { id } = useParams();
  const notify = useSelector(
    (TenantComponentSlice) => TenantComponentSlice.tenantMaster.notify
  );

  const stateDropdown = useSelector(
    (DashbordSlice) => DashbordSlice.dashboard.stateData
  );
  const [stateDropdownData, setStateDropdownData] = useState([]);

  const [cityDropdownData, setCityDropdownData] = useState(false);

  const CountryData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.filteredCountryData
  );

  const AllcityDropDownData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.cityData
  );
  const tenanatId = id;
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

  const [errorMessage, setErrorMessage] = useState('');

  const [inputState, setInputState] = useState({});
  const initialValues = {
    company_name: data?.company_name || '',
    series: data?.series || '',
    company_type: data?.company_type || '',
    email_id: data?.email_id || '',
    contact_no: data?.contact_no || '',
    address: data?.address || '',
    pincode: data?.pincode || '',
    country_id: data?.country_id || '',
    state_id: data?.state_id || '',
    city_id: data?.city_id || '',
    status: toggleRadio ? 'active' : 'deactive'
  };
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

  const stateRef = useRef(null);
  const cityRef = useRef(null);

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
  const loadData = useCallback(async () => {
    dispatch(getCountryDataSort());

    dispatch(getRoles());
    dispatch(getStateDataSort());

    await new TenantService().getTenantById(tenanatId).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          if (res?.data?.data?.is_active === 1) {
            setToggleRadio(true);
          } else {
            setToggleRadio(false);
          }
          setData(res.data.data);
        }
      }
    });
  }, [dispatch, tenanatId]);

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
    formData.append('is_active', toggleRadio ? 1 : 0);
    dispatch(updatetenantData({ id: tenanatId, payload: formData })).then(
      (res) => {
        if (res.payload.data.status === 1 && res.payload.status === 200) {
          navigate(`/${_base}/TenantMaster`);
          dispatch(getAllTenant());
          toast.success(res.payload.data.message, {
            autoClose: 10000
          });
        } else {
          toast.error(res.payload.data.message, {
            autoClose: 10000
          });
        }
      }
    );
  };

  const handleKeyPress = (e) => {
    if (Validation.onlyCapitalLetter(e)) {
      setErrorMessage('');
    } else {
      setErrorMessage('Only capital letters are allowed');
    }
  };
  const handleRadios = (e) => {
    if (e === 'active') {
      setToggleRadio(true);
    } else {
      setToggleRadio(false);
    }
  };

  useEffect(() => {
    dispatch(getStateData());
    dispatch(getCityData());

    dispatch(handleError(null));
    loadData();
  }, [dispatch, loadData]);

  useEffect(() => {
    if (data) {
      const initialStateData = stateDropdown
        .filter(
          (filterState) =>
            filterState.is_active === 1 &&
            filterState.country_id === data.country_id
        )
        .map((d) => ({ value: d.id, label: d.state }));

      const initialCityData = AllcityDropDownData.filter(
        (filterState) =>
          filterState.is_active === 1 && filterState.state_id === data.state_id
      ).map((d) => ({ value: d.id, label: d.city }));

      setStateDropdownData(initialStateData);
      setCityDropdownData(initialCityData);
    }
  }, [data, stateDropdown, AllcityDropDownData]);
  useEffect(() => {
    if (checkRole && checkRole[0]?.can_update === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);
  return (
    <div className="container-xxl">
      {notify && notify?.type === 'danger' && <Alert alertData={notify} />}
      <PageHeader headerTitle="Edit Tenant" />
      {data && (
        <Formik
          initialValues={initialValues}
          validationSchema={TenantValidation}
          onSubmit={(values) => {
            handleForm(values);
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue
          }) => (
            <Form onSubmit={handleSubmit}>
              <div className="card card-body">
                {/* Tenant Name */}
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Tenant Name :<Astrick color="red" />
                    </b>
                  </label>
                  <div className="col-sm-4">
                    <Field
                      type="text"
                      className="form-control form-control-sm"
                      id="company_name"
                      name="company_name"
                      placeholder="Company Name"
                      required
                      onKeyPress={(e) => Validation.CharacterWithSpace(e)}
                    />
                    <ErrorMessage
                      name="company_name"
                      component="div"
                      style={{ color: 'red' }}
                    />
                  </div>
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Ticket ID Series :<Astrick color="red" />
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
                      required
                      readOnly
                      onKeyPress={(e) => handleKeyPress(e)}
                    />
                    <ErrorMessage
                      name="series"
                      component="div"
                      style={{ color: 'red' }}
                    />
                  </div>
                </div>

                <div className="form-group row mt-2"></div>

                <div className="form-group row mt-2">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Company Type : <Astrick color="red" />
                    </b>
                  </label>

                  <div className="col-sm-8">
                    <div className="row">
                      <div className="col-sm-6">
                        <Field
                          name="company_type"
                          component={Select}
                          options={companyType}
                          value={
                            companyType &&
                            companyType.find(
                              (option) =>
                                option.value.trim() ===
                                values.company_type.trim()
                            )
                          }
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
                      Email Address :<Astrick color="red" />
                    </b>
                  </label>
                  <div className="col-sm-4">
                    <Field
                      type="email"
                      className="form-control form-control-sm"
                      id="email_id"
                      name="email_id"
                      placeholder="Email Address"
                      required
                      onKeyPress={(e) => Validation.emailOnly(e)}
                    />
                  </div>
                </div>

                <div className="form-group row mt-2">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Contact Number :<Astrick color="red" />
                    </b>
                  </label>
                  <div className="col-sm-4">
                    <Field
                      type="text"
                      className="form-control form-control-sm"
                      id="contact_no"
                      name="contact_no"
                      placeholder="Contact Number"
                      required
                      minLength={10}
                      maxLength={10}
                      value={values.contact_no}
                      onChange={handleChange}
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
                        component="textarea"
                        className="form-control form-control-sm"
                        id="address"
                        name="address"
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
                        onKeyPress={(e) => Validation.NumbersOnly(e)}
                      />
                    </div>

                    <label
                      className="col-sm-2 col-form-label"
                      style={{ textAlign: 'right' }}
                    >
                      <b>Country : </b>
                    </label>
                    <div className="col-sm-4">
                      {CountryData && data && (
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
                      )}
                    </div>
                  </div>

                  <div className="form-group row mt-3">
                    <label className="col-sm-2 col-form-label">
                      <b>State : </b>
                    </label>
                    <div className="col-sm-4">
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
                    </div>

                    <label
                      className="col-sm-2 col-form-label"
                      style={{ textAlign: 'right' }}
                    >
                      <b>City : </b>
                    </label>
                    <div className="col-sm-4">
                      {AllcityDropDownData && data && (
                        <Field
                          name="city_id"
                          component={Select}
                          options={cityDropdownData}
                          value={
                            cityDropdownData &&
                            cityDropdownData?.find(
                              (option) => option.value === values?.city_id
                            )
                          }
                          onChange={(selectedOption) => {
                            setFieldValue(
                              'city_id',
                              selectedOption ? selectedOption.value : ''
                            );

                            handleDependentChange(
                              selectedOption,
                              'CITY',
                              setFieldValue
                            );
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3" style={{ textAlign: 'right' }}>
                {checkRole && checkRole[0]?.can_update === 1 ? (
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                ) : (
                  ''
                )}
                <Link
                  to={`/${_base}/TenantMaster`}
                  className="btn btn-danger text-white"
                >
                  Cancel
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
