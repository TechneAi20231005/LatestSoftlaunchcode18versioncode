import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import PageHeader from '../../../components/Common/PageHeader';
import Alert from '../../../components/Common/Alert';
import { Astrick } from '../../../components/Utilities/Style';
import * as Validation from '../../../components/Utilities/Validation';
import { _base } from '../../../settings/constants';
import Select from 'react-select';

import { useDispatch, useSelector } from 'react-redux';

import {
  getCityData,
  getCountryDataSort,
  getCustomerData,
  getCustomerType,
  getRoles,
  getStateData,
  postCustomerData
} from '../../Dashboard/DashboardAction';
export default function CreateCustomer({ match }) {
  const [updateStatus, setUpdateStatus] = useState({});

  const [stateName, setStateName] = useState(null);
  const [cityName, setCityName] = useState(null);

  const [contactError, setContactError] = useState(null);
  // const [contactErr, setContactErr] = useState(false);
  const [contactNumber, setContactNumber] = useState(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const customerType = useSelector(
    (DashbordSlice) => DashbordSlice.dashboard.customerTypeData
  );
  const countryDropdown = useSelector(
    (DashbordSlice) => DashbordSlice.dashboard.filteredCountryData
  );
  const stateDropdown = useSelector(
    (DashbordSlice) => DashbordSlice.dashboard.FilterState
  );

  const AllcityDropDownData = useSelector(
    (DashbordSlice) => DashbordSlice.dashboard.FilterCity
  );

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id === 4)
  );

  const Notify = useSelector((dashbordSlice) => dashbordSlice.dashboard.notify);

  const [stateDropdownData, setStateDropdownData] = useState(false);
  const [cityDropdownData, setCityDropdownData] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (newEmail.trim() === '') {
      setIsValidEmail(true);
    } else {
      const isValid = validateEmail(newEmail);
      setIsValidEmail(isValid);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleMobileValidation = (e) => {
    const contactNumber = e.target.value;
    setContactNumber(contactNumber);
    if (
      contactNumber.charAt(0) === '9' ||
      contactNumber.charAt(0) === '8' ||
      contactNumber.charAt(0) === '7' ||
      contactNumber.charAt(0) === '6'
    ) {
      if (/^[0]+$/.test(contactNumber)) {
        // setContactErr(true);
        setContactError('Invalid Mobile Number');
      } else {
        // setContactErr(false);
        setContactError('');
      }
    } else if (contactNumber.length === 10) {
      // setContactErr(true);
      setContactError('Invalid Mobile Number');
    } else {
      setContactError('');
    }
  };

  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    var flag = 1;
    // setNotify(null);

    var customerType = formData.getAll('customer_type_id');
    var selectEmail = formData.getAll('email_id');
    var selectCountry = formData.getAll('country_id');
    var selectState = formData.getAll('state_id');
    var selectCity = formData.getAll('city_id');

    if (
      customerType === '' ||
      selectEmail === '' ||
      selectCountry === '' ||
      selectState === '' ||
      selectCity === ''
    ) {
      flag = 0;
      // setNotify(null);
      if (customerType === '') {
        alert('Please Select Customer Type');
      } else if (selectEmail === '') {
        alert('Please Select Email');
      } else if (selectCountry === '') {
        alert('Please Select Country');
      } else if (selectState === '') {
        alert('Please Select State');
      } else if (selectCity === '') {
        alert('Please Select City');
      } else {
        alert('Please Check Form');
      }
    }

    if (contactNumber.length < 10) {
      alert('Mobile Number Field should be 10 Digits');
      return false;
    } else {
      if (flag === 1) {
        dispatch(postCustomerData(formData)).then((res) => {
          if (
            res?.payload?.data?.status === 1 &&
            res?.payload?.status === 200
          ) {
            dispatch(getCustomerData());
            setTimeout(() => {
              navigate(`/${_base}/Customer`, {
                state: {
                  alert: {
                    type: 'success',
                    message: res?.payload?.data?.message
                  }
                }
              });
            }, 3000);
          } else {
            // setNotify({ type: 'danger', message: res?.payload?.data?.message });
          }
        });
      }
    }
  };

  const handleCountryChange = (e) => {
    setStateDropdownData(
      stateDropdown
        .filter((filterState) => filterState.country_id === e.value)
        .map((d) => ({ value: d.id, label: d.state }))
    );

    const newStatus = { ...updateStatus, statedrp: 1 };
    setUpdateStatus(newStatus);
    setStateName(null);
    setCityName(null);
  };

  const handleStateChange = (e) => {
    setCityDropdownData(
      AllcityDropDownData.filter(
        (filterState) => filterState.state_id === e.value
      ).map((d) => ({ value: d.id, label: d.city }))
    );

    const newStatus = { ...updateStatus, citydrp: 1 };
    setUpdateStatus(newStatus);
    setStateName(e);
    setCityName(null);
  };

  const onTestChange = () => {
    var key = window.event.keyCode;

    if (key === 13) {
      document.getElementById('txtArea').value =
        document.getElementById('txtArea').value + '\n*';
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    dispatch(getCityData());
    dispatch(getStateData());
    dispatch(getCountryDataSort());
    dispatch(getCityData());
    if (!customerType?.length) {
      dispatch(getCustomerType());
    }
    if (!stateDropdown?.length) {
    }
    if (!countryDropdown?.length) {
    }
    if (!checkRole?.length) {
      dispatch(getRoles());
    }

    if (!cityDropdownData?.length) {
    }
  }, [
    checkRole.length,
    cityDropdownData.length,
    countryDropdown.length,
    customerType.length,
    dispatch,
    stateDropdown.length
  ]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_create === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      {Notify && <Alert alertData={Notify} />}

      <PageHeader headerTitle="Add Customer" />

      <div className="row clearfix g-3">
        <div className="col-sm-12">
          <form onSubmit={handleForm}>
            {/* ********* MAIN DATA ********* */}
            <div className="card mt-2">
              <div className="card-header bg-primary text-white p-2">
                <h5>Customer Details</h5>
              </div>
              <div className="card-body">
                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Customer Name : <Astrick color="red" size="13px" />
                    </b>
                  </label>
                  <div className="col-sm-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="name"
                      name="name"
                      placeholder="Customer Name"
                      maxLength={30}
                      required
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersOnly(e);
                      }}
                    />
                  </div>
                </div>

                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Customer Type : <Astrick color="red" size="13px" />
                    </b>
                  </label>
                  <div className="col-sm-4">
                    {customerType && (
                      <Select
                        options={customerType}
                        name="customer_type_id"
                        id="customer_type_id"
                        required
                      />
                    )}
                  </div>
                </div>

                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Email Address :<Astrick color="red" size="13px" />
                    </b>
                  </label>

                  <div className="col-sm-4">
                    <input
                      type="email"
                      className={`form-control form-control-sm ${
                        isValidEmail ? '' : 'is-invalid'
                      }`}
                      id="email_id"
                      name="email_id"
                      placeholder="Email Address"
                      value={email}
                      onChange={handleEmailChange}
                      required
                    />
                    {!isValidEmail && (
                      <div className="invalid-feedback">
                        Please enter a valid email address.
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Contact Number :<Astrick color="red" size="13px" />
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
                      onKeyPress={(e) => {
                        Validation.mobileNumbersOnly(e);
                      }}
                      onChange={handleMobileValidation}
                      autoComplete="off"
                    />
                  </div>
                </div>
                {contactError && (
                  <small
                    style={{
                      color: 'red',
                      position: 'relative',
                      left: '12.375rem'
                    }}
                  >
                    {contactError}
                  </small>
                )}
              </div>{' '}
              {/* CARD BODY */}
            </div>
            {/* CARD */}

            <div className="card mt-2">
              <div className="card-header bg-primary text-white p-2">
                <h5>Address Details</h5>
              </div>
              <div className="card-body">
                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Address :<Astrick color="red" size="13px" />{' '}
                    </b>
                  </label>
                  <div className="col-sm-10">
                    <textarea
                      className="form-control form-control-sm"
                      placeholder="Enter maximum 250 characters"
                      id="address"
                      name="address"
                      required
                      maxLength={250}
                      onChange={onTestChange}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                        } else {
                          Validation.addressField(e);
                        }
                      }}
                      rows="3"
                    />
                  </div>
                </div>

                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Pincode : <Astrick color="red" />
                    </b>
                  </label>
                  <div className="col-sm-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="pincode"
                      name="pincode"
                      minLength={6}
                      maxLength={6}
                      onKeyPress={(e) => {
                        Validation.pincodeWithOutSpace(e);
                      }}
                      required
                      autoComplete="off"
                    />
                  </div>

                  <label
                    className="col-sm-2 col-form-label"
                    style={{ textAlign: 'right' }}
                  >
                    <b>
                      Country : <Astrick color="red" />
                    </b>
                  </label>
                  <div className="col-sm-4">
                    <Select
                      options={countryDropdown}
                      id="country_id"
                      name="country_id"
                      onChange={handleCountryChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      State : <Astrick color="red" />
                    </b>
                  </label>
                  <div className="col-sm-4">
                    <Select
                      options={
                        updateStatus.statedrp !== undefined
                          ? stateDropdownData
                          : []
                      }
                      id="state_id"
                      name="state_id"
                      onChange={handleStateChange}
                      required
                      defaultValue={stateName}
                      value={stateName}
                    />
                  </div>

                  <label
                    className="col-sm-2 col-form-label"
                    style={{ textAlign: 'right' }}
                  >
                    <b>
                      City : <Astrick color="red" />
                    </b>
                  </label>

                  <div className="col-sm-4">
                    <Select
                      options={
                        updateStatus.citydrp !== undefined
                          ? cityDropdownData
                          : []
                      }
                      id="city_id"
                      name="city_id"
                      onChange={(e) => setCityName(e)}
                      required
                      defaultValue={cityName}
                      value={cityName}
                    />
                  </div>
                </div>
              </div>
              {/* CARD BODY*/}
            </div>
            {/* CARD */}

            <div className="mt-3" style={{ textAlign: 'right' }}>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <Link
                to={`/${_base}/Customer`}
                className="btn btn-danger text-white"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
