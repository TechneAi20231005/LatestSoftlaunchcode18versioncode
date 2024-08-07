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

  console.log(
    'filterdata',
    AllcityDropDownData.filter((d) => d.is_active === 1)
  );
  console.log('AllcityDropDownData', AllcityDropDownData);
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

  // const [state, setState] = useState(null);

  const state = null;

  const [stateDropdownData, setStateDropdownData] = useState(false);
  const [cityDropdownData, setCityDropdownData] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDependentChange = (e, type) => {
    if (type === 'COUNTRY') {
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

        // AllcityDropDownData.filter(
        //   (filterState) => filterState.state_id === e.value
        // ).map((d) => ({ value: d.id, label: d.city }))
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

  const loadData = useCallback(async () => {
    dispatch(getCountryDataSort());
    dispatch(getRoles());
    dispatch(getStateDataSort());
    dispatch(getCityData());
    dispatch(getStateData());
  }, [dispatch]);
  const handleForm = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    dispatch(posttenantData(formData)).then((res) => {
      if (res?.payload?.data?.status === 1 && res?.payload?.status === 200) {
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
      // alert("Rushi")

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
      <form onSubmit={handleForm} method="">
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
                onKeyPress={(e) => {
                  Validation.CharactersNumbersOnly(e);
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
              />

              <div className="form-group row mt-3">
                <div className="col-sm-12">
                  <h5 className="text-danger">
                    <b>Important Note:</b>
                  </h5>
                  <ul>
                    <li>Do not make any changes in first row</li>
                    <li>Do not change query type after export in file</li>
                  </ul>
                </div>
              </div>
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
                type="text"
                className="form-control form-control-sm"
                id="email_id"
                name="email_id"
                placeholder="Email Address"
                required
                onKeyPress={(e) => {
                  Validation.emailOnly(e);
                }}
                // value={email}
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
                  minLength={6}
                  maxLength={6}
                  onChange={(e) => {
                    Validation.NumbersOnlyForPincode(e);
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
                {CountryData && (
                  <Select
                    options={CountryData}
                    id="country_id"
                    name="country_id"
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
                {stateDropdownData && (
                  <Select
                    options={stateDropdownData}
                    id="state_id"
                    name="state_id"
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
                {cityDropdownData && (
                  <Select
                    options={cityDropdownData}
                    id="city_id"
                    name="city_id"
                    onChange={(e) => handleDependentChange(e, 'CITY')}
                  />
                )}
              </div>
            </div>
          </div>
          {/* CARD BODY*/}

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
      </form>
    </div>
  );
}
