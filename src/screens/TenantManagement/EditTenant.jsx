import React, { useCallback, useEffect, useState } from 'react';
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

export default function EditTenant({ match }) {
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
  // const cityDropdown = useSelector(
  //   (DashbordSlice) => DashbordSlice.dashboard.sortedCityData
  // );
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

  // const [contactValid, setContactValid] = useState(false);

  // const [contactNumber, setContactNumber] = useState(null);
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
      // setContactValid(false);
    } else {
      // setContactValid(true);
    }

    if (contactValidation.includes('000000000')) {
      setInputState({
        ...state,
        contactNoErr: 'System not accepting 9 Consecutive Zeros here.'
      });
      // setContactValid(true);
    }

    if (contactValidation.length < 10) {
      if (contactValidation.length === 0) {
        setInputState({
          ...state,
          contactNoErr: 'please enter Mobile Number'
        });
        // setContactValid(true);
      }
      setInputState({
        ...state,
        contactNoErr: 'Invalid Mobile Number'
      });
      // setContactValid(true);
    }

    if (contactValidation.length < 11) {
      // setContactNumber(contactValidation);
    }
  };
  const handleDependentChange = (e, type) => {
    if (type === 'COUNTRY') {
      setClearFlag(true);
      setStateDropdownData(
        stateDropdown
          .filter(
            (filterState) =>
              filterState.is_active === 1 && filterState.country_id === e.value
          )
          .map((d) => ({ value: d.id, label: d.state }))
      );
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
    dispatch(getStateData());
    dispatch(getCityData());

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

  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('is_active', toggleRadio ? 1 : 0);
    dispatch(updatetenantData({ id: tenanatId, payload: formData })).then(
      (res) => {
        if (res.payload.data.status === 1 && res.payload.status === 200) {
          navigate(`/${_base}/TenantMaster`);
          dispatch(getAllTenant());
          dispatch(
            handleError({ type: 'success', message: res.payload.data.message })
          );
        } else {
          dispatch(
            handleError({ type: 'danger', message: res.payload.data.message })
          );
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
  // const useDataState = stateDropdown.filter((d) => d.id === data?.state_id);

  useEffect(() => {
    dispatch(handleError(null));
    loadData();
  }, [dispatch, loadData]);

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
        <form onSubmit={handleForm}>
          <div className="card card-body">
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">
                <b>
                  Tenant Name :<Astrick color="red" />
                </b>
              </label>
              <div className="col-sm-4">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="company_name"
                  name="company_name"
                  placeholder="Company Name"
                  required
                  defaultValue={data && data.company_name}
                  onKeyPress={(e) => {
                    Validation.CharacterWithSpace(e);
                  }}
                />
              </div>
              <label className="col-sm-2 col-form-label">
                <b>
                  Ticket ID Series :<Astrick color="red" />
                </b>
              </label>
              <div className="col-sm-4">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="series"
                  name="series"
                  placeholder="Enter Tenant Id Series"
                  maxLength={2}
                  required
                  readOnly
                  defaultValue={data && data.series}
                  onKeyPress={(e) => handleKeyPress(e)}
                />
                {errorMessage && (
                  <div style={{ color: 'red' }}>{errorMessage}</div>
                )}
              </div>
            </div>

            {/* <div className="form-group row mt-2">
              <label className="col-sm-2 col-form-label">
                <b>
                  Company Type : <Astrick color="red" />
                </b>
              </label>
              <div className="col-sm-4">
                <Select
                  name="company_type"
                  id="company_type"
                  options={companyType}
                  defaultValue={
                    data &&
                    companyType
                      .filter((d) => d.value == data.company_type)
                      .map((d) => ({ label: d.label, value: d.value }))
                  }
                />
              </div>
            </div> */}

            <div className="form-group row mt-2">
              <label className="col-sm-2 col-form-label">
                <b>
                  Company Type : <Astrick color="red" />
                </b>
              </label>
              <div className="col-sm-8">
                {' '}
                {/* Use col-sm-10 to make Select take up remaining space */}
                <div className="row">
                  {' '}
                  {/* Nested row */}
                  <div className="col-sm-6">
                    {' '}
                    {/* Adjust the width of the Select */}
                    <Select
                      name="company_type"
                      id="company_type"
                      options={companyType}
                      defaultValue={
                        data &&
                        companyType
                          .filter((d) => d.value === data.company_type)
                          .map((d) => ({ label: d.label, value: d.value }))
                      }
                    />
                  </div>
                  <div className="col-sm-6">
                    {' '}
                    {/* Use the remaining space for the note */}
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
                <input
                  type="email"
                  className="form-control form-control-sm"
                  id="email_id"
                  name="email_id"
                  placeholder="Email Address"
                  required
                  defaultValue={data && data.email_id}
                  onKeyPress={(e) => {
                    Validation.emailOnly(e);
                  }}
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
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="contact_no"
                  name="contact_no"
                  placeholder="Contact Number"
                  required
                  minLength={10}
                  maxLength={10}
                  onChange={handleContactValidation}
                  defaultValue={data && data.contact_no}
                  onKeyPress={(e) => {
                    Validation.MobileNumbersOnly(e);
                  }}
                />
                {inputState && (
                  <small
                    style={{
                      color: 'red'
                    }}
                  >
                    {inputState.contactNoErr}
                  </small>
                )}
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
                  <textarea
                    className="form-control form-control-sm"
                    id="address"
                    name="address"
                    defaultValue={data && data.address}
                  />
                </div>
              </div>

              <div className="form-group row mt-3">
                <label className="col-sm-2 col-form-label">
                  <b>Pincode : </b>
                </label>
                <div className="col-sm-4">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="pincode"
                    name="pincode"
                    defaultValue={data && data.pincode}
                    minLength={6}
                    maxLength={6}
                    onKeyPress={(e) => {
                      Validation.NumbersOnly(e);
                    }}
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
                    <Select
                      options={CountryData}
                      id="country_id"
                      name="country_id"
                      defaultValue={
                        data &&
                        CountryData &&
                        CountryData.filter((d) => data?.country_id === d.value)
                      }
                      onChange={(e) => handleDependentChange(e, 'COUNTRY')}
                    />
                  )}
                </div>
              </div>

              <div className="form-group row mt-3">
                <label className="col-sm-2 col-form-label">
                  <b>State : </b>
                </label>

                <div className="col-sm-4">
                  {stateDropdown && data && (
                    <Select
                      options={stateDropdownData}
                      id="state_id"
                      name="state_id"
                      defaultValue={
                        clearFlag
                          ? { label: '' }
                          : data &&
                            stateDropdown &&
                            stateDropdown
                              .filter((d) => d.id === data.state_id)
                              .map((stateName) => ({
                                value: stateName.id,
                                label: stateName.state
                              }))
                      }
                      onChange={(e) => handleDependentChange(e, 'STATE')}
                    />
                  )}
                </div>

                <label
                  className="col-sm-2 col-form-label"
                  style={{ textAlign: 'right' }}
                >
                  <b>City : </b>
                </label>

                <div className="col-sm-4">
                  {AllcityDropDownData && data && (
                    <Select
                      options={cityDropdownData}
                      id="city_id"
                      name="city_id"
                      defaultValue={
                        data &&
                        AllcityDropDownData &&
                        AllcityDropDownData.filter(
                          (d) => d.id === data.city_id
                        ).map((city) => ({ value: city.id, label: city.city }))
                      }
                      onChange={(e) => handleDependentChange(e, 'CITY')}
                    />
                  )}
                </div>
              </div>
              <div className="d-flex mt-3">
                <div className="col-sm-2">
                  <b>Status :</b>
                </div>
                <div className="me-5">
                  <input
                    type="radio"
                    checked={toggleRadio}
                    className="me-4"
                    value="active"
                    onChange={(e) => handleRadios(e.target.value)}
                  />
                  <label>
                    <b>Active</b>
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    checked={!toggleRadio}
                    className="me-4"
                    value="deactive"
                    onChange={(e) => handleRadios(e.target.value)}
                  />
                  <label>
                    <b>Deactive</b>
                  </label>
                </div>
              </div>
            </div>
            {/* CARD BODY*/}

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
          </div>
        </form>
      )}
    </div>
  );
}
