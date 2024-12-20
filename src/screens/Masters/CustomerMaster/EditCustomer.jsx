import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorLogService from '../../../services/ErrorLogService';
import CustomerService from '../../../services/MastersService/CustomerService';

import CustomerType from '../../../services/MastersService/CustomerTypeService';
import CountryService from '../../../services/MastersService/CountryService';
import StateService from '../../../services/MastersService/StateService';
import CityService from '../../../services/MastersService/CityService';
import PageHeader from '../../../components/Common/PageHeader';
import Alert from '../../../components/Common/Alert';
import { Astrick } from '../../../components/Utilities/Style';
import * as Validation from '../../../components/Utilities/Validation';
import { _base } from '../../../settings/constants';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';
import { toast } from 'react-toastify';
import { CustomValidation } from '../../../components/custom/CustomValidation/CustomValidation';
import { Field, Form, Formik, ErrorMessage } from 'formik';

function EditCustomer() {
  const history = useNavigate();
  const [notify, setNotify] = useState(null);

  const { id } = useParams();
  const customerId = id;
  const dispatch = useDispatch();
  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id === 4)
  );

  const [data, setData] = useState(null);
  const [customerType, setCustomerType] = useState(null);

  // const [country, setCountry] = useState(null);
  const [countryDropdown, setCountryDropdown] = useState(null);
  const [state, setState] = useState(null);
  const [stateDropdown, setStateDropdown] = useState(null);
  const [city, setCity] = useState(null);
  const [cityDropdown, setCityDropdown] = useState(null);

  const [updateStatus, setUpdateStatus] = useState({});

  const [stateName, setStateName] = useState(null);
  const [cityName, setCityName] = useState(null);

  const loadData = useCallback(async () => {
    await new CustomerService()
      .getCustomerById(customerId)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            console.log(res.data.data, 'res');
            setData(res.data.data);
          } else {
            setNotify({ type: 'danger', message: res.data.message });
          }
        } else {
          setNotify({ type: 'danger', message: res.message });
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          'Customer',
          'Get_Customer',
          'INSERT',
          errorObject.data.message
        );
      });

    await new CustomerType().getCustomerType().then((res) => {
      if (res.status === 200) {
        const data = res.data.data?.data;
        console.log(data,"data>>>.")
        setCustomerType(
          data
            .filter((d) => d.is_active === 1)
            .map((d) => ({ label: d.type_name, value: d.id }))
        );
      }
    });

    //  **************************Country load data**************************************
    await new CountryService().getCountrySort().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setCountryDropdown(
            res.data.data?.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({ value: d.id, label: d.country }))
          );
        }
      }
    });
    //  ************************** State load data**************************************
    await new StateService().getStateSort().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setState(res.data.data?.data.filter((d) => d.is_active === 1));
          setStateDropdown(
            res.data.data?.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({
                value: d.id,
                label: d.state,
                country_id: d.country_id
              }))
          );
        }
      }
    });
    //  ************************** city load data**************************************
    await new CityService().getCity().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setCity(res.data.data?.data.filter((d) => d.is_active === 1));
          setCityDropdown(
            res.data.data?.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({
                value: d.id,
                label: d.city,
                state_id: d.state_id
              }))
          );
        }
      }
    });

    dispatch(getRoles());
  }, [customerId, dispatch]);

  const [emailError, setEmailError] = useState('');
  const [mailError, setMailError] = useState(false);

  const handleEmail = (e) => {
    const email = e.target.value;
    const emailRegex =
      /^([a-z\d.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
    if (emailRegex.test(email) === false) {
      setEmailError('Invalid Email');
      setMailError(true);
    } else {
      setEmailError('');
      setMailError(false);
    }
  };
  const [contactError, setContactError] = useState(null);
  const handleMobileValidation = (e) => {
    const contactNumber = e.target.value;

    if (
      contactNumber.charAt(0) === '9' ||
      contactNumber.charAt(0) === '8' ||
      contactNumber.charAt(0) === '7' ||
      contactNumber.charAt(0) === '6'
    ) {
      setContactError('');
    } else if (contactNumber.length === 10) {
      setContactError('Invalid Mobile Number');
    } else {
      setContactError('');
    }
  };

  const handleForm = async (values) => {
    // e.preventDefault();
    const formData = new FormData();
    formData.append('address', values.address);
    formData.append('city_id', values.city_id);
    formData.append('contact_no', values.contact_no);
    formData.append('country_id', values.country_id);
    formData.append('customer_type_id', values.customer_type_id);
    formData.append('email_id', values.email_id);
    formData.append('name', values.name);
    formData.append('pincode', values.pincode);
    formData.append('state_id', values.state_id);
    formData.append('remark', values.remark);
    formData.append('is_active', values.is_active);
    // var flag = 1;

    // var customerType = formData.getAll('customer_type_id');
    // var selectEmail = formData.getAll('email_id');
    // var selectCountry = formData.getAll('country_id');
    // var selectState = formData.getAll('state_id');
    // var selectCity = formData.getAll('city_id');

    // if (
    //   customerType === '' ||
    //   selectEmail === '' ||
    //   selectCountry === '' ||
    //   selectState === '' ||
    //   selectCity === ''
    // ) {
    //   flag = 0;
    //   setNotify(null);
    //   if (customerType === '') {
    //     alert('Please Select Customer Type');
    //   } else if (selectEmail === '') {
    //     alert('Please Select Email');
    //   } else if (selectCountry === '') {
    //     alert('Please Select Country');
    //   } else if (selectState === '') {
    //     alert('Please Select State');
    //   } else if (selectCity === '') {
    //     alert('Please Select City');
    //   } else {
    //   }
    // }

    // if (flag === 1) {
    setNotify(null);
    await new CustomerService()
      .updateCustomer(customerId, formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            toast.success(res.data.message, {
              position: 'top-right'
            });
            history(
              {
                pathname: `/${_base}/Customer`
              }
              // {
              //   state: {
              //     type: 'success',
              //     message: res.data.message
              //   }
              // }
            );
          } else {
            toast.error(res.data.message, {
              position: 'top-right'
            });
            // setNotify({ type: 'danger', message: res.data.message });
          }
        } else {
          // setNotify({ type: 'danger', message: res.message });
          toast.error(res.data.message, {
            position: 'top-right'
          });
          new ErrorLogService().sendErrorLog(
            'Customer',
            'Create_Customer',
            'INSERT',
            res.message
          );
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        // setNotify({ type: 'danger', message: 'Request Error !!!' });
        toast.error('Request Error !!!', {
          position: 'top-right'
        });

        new ErrorLogService().sendErrorLog(
          'Customer',
          'Create_Customer',
          'INSERT',
          errorObject.data.message
        );
      });
    // }
  };

  const handleCountryChange = (e) => {
    setStateDropdown(
      state
        .filter((d) => d.country_id === e.value)
        .map((d) => ({ value: d.id, label: d.state }))
    );
    const newStatus = { ...updateStatus, statedrp: 1 };
    setUpdateStatus(newStatus);
    setStateName(null);
    setCityName(null);
    // setCityDropdown(null);
  };

  const handleStateChange = (e) => {
    setCityDropdown(
      city
        .filter((d) => d.state_id === e.value)
        .map((d) => ({ value: d.id, label: d.city }))
    );
    const newStatus = { ...updateStatus, citydrp: 1 };
    setUpdateStatus(newStatus);
    setStateName(e);
    setCityName(null);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (
      data !== null &&
      stateDropdown !== null &&
      updateStatus.statedrp === undefined
    ) {
      setStateDropdown((prev) =>
        prev.filter((stateItem) => stateItem.country_id === data.country_id)
      );
      const newStatus = { ...updateStatus, statedrp: 1 };
      setUpdateStatus(newStatus);
      setStateName(
        data &&
          stateDropdown &&
          stateDropdown.filter((d) => d.value === data.state_id)
      );
    }
  }, [data, stateDropdown, updateStatus]);

  useEffect(() => {
    if (
      data !== null &&
      cityDropdown !== null &&
      updateStatus.citydrp === undefined
    ) {
      setCityDropdown((prev) =>
        prev.filter((stateItem) => stateItem.state_id === data.state_id)
      );
      const newStatus = { ...updateStatus, citydrp: 1 };
      setUpdateStatus(newStatus);
      setCityName(
        data &&
          cityDropdown &&
          cityDropdown.filter((d) => d.value === data.city_id)
          ? data &&
              cityDropdown &&
              cityDropdown.filter((d) => d.value === data.city_id)
          : cityName
      );
    }
    if (checkRole && checkRole[0]?.can_update === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [data, cityDropdown, checkRole, updateStatus, cityName]);

  let customerdata =
    data &&
    customerType?.find((d) => d.value === Number(data.customer_type_id));
  console.log(customerdata, 'customerdata');

  const initialValue = {
    name: data ? data?.name : '',
    customer_type_id: data?.customer_type_id || '',
    email_id: data ? data?.email_id : '',
    contact_no: data ? data?.contact_no : '',
    remark: data?.remark || '',
    address: data ? data?.address : '',
    pincode: data ? data?.pincode : '',
    country_id: data?.country_id || '',
    state_id: data?.state_id || '',
    city_id: data?.city_id || '',
    is_active: data?.is_active !== undefined ? String(data?.is_active) : '1'
  };
  const fields = [
    {
      name: 'name',
      label: 'Customer name',
      required: true,
      alphaNumeric: true,
      max: 100
    },
    { name: 'customer_type_id', label: 'Customer Type', required: true },
    { name: 'email_id', label: 'Email Id', email: true },
    { name: 'contact_no', label: '', phone: true },
    {
      name: 'address',
      label: 'Address',
      max: 1000,
      required: true,
      alphaNumeric: true
    },
    { name: 'pincode', label: '', pincode: true },
    { name: 'country_id', label: 'Country Name', required: true },
    { name: 'state_id', label: 'State Name', required: true },
    { name: 'city_id', label: 'City Name', required: true },
    { name: 'remark', label: 'Remark', alphaNumeric: true, required: false, max: 1000, }
  ];

  const validationSchema = CustomValidation(fields);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader headerTitle="Edit Customer" />

      <div className="row clearfix g-3">
        <div className="col-sm-12">
          {data && (
            <Formik
              initialValues={initialValue}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                console.log(values, 'values');
                handleForm(values);
                // setOtpModal(true);
              }}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form>
                  {/* <form onSubmit={handleForm}> */}
                  {/* ********* MAIN DATA ********* */}
                  <div className="card mt-2">
                    <div className="card-header bg-primary text-white p-2">
                      <h5>Customer Details</h5>
                    </div>
                    <div className="card-body">
                      <div className="form-group row">
                        <label className="col-sm-2 col-form-label">
                          <b>
                            Customer Name : <Astrick color="red" size="13px" />
                          </b>
                        </label>
                        <div className="col-sm-4">
                          <Field
                            type="text"
                            className="form-control form-control-sm"
                            id="name"
                            name="name"
                            placeholder="Customer Name"
                            maxLength={30}
                            // required
                            // defaultValue={data ? data.name : null}
                            onKeyPress={(e) => {
                              Validation.CharactersOnly(e);
                            }}
                          />
                          <ErrorMessage
                            name="name"
                            component="small"
                            className="text-danger"
                          />
                        </div>
                      </div>

                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>
                            Customer Type :<Astrick color="red" size="13px" />
                          </b>
                        </label>
                        <div className="col-sm-4">
                          {customerType && data.customer_type_id && (
                            <Field
                              options={customerType}
                              name="customer_type_id"
                              component={Select}
                              id="customer_type_id"
                              onChange={(option) => {
                                setFieldValue(
                                  'customer_type_id',
                                  option?.value
                                );
                              }}
                              // required
                              value={
                                data &&
                                customerType?.find(
                                  (d) =>
                                    d.value === Number(values.customer_type_id)
                                )
                              }
                            />
                          )}
                          <ErrorMessage
                            name="customer_type_id"
                            component="small"
                            className="text-danger"
                          />
                        </div>
                      </div>

                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>
                            Email Address :<Astrick color="red" size="13px" />
                          </b>
                        </label>
                        <div className="col-sm-4">
                          <Field
                            type="text"
                            className="form-control form-control-sm"
                            id="email_id"
                            name="email_id"
                            placeholder="Email Address"
                            // required
                            // onChange={handleEmail}
                            onKeyPress={(e) => {
                              Validation.emailOnly(e);
                            }}
                            // defaultValue={data.email_id}
                          />
                          {/* {mailError && (
                        <div className="text-danger">{emailError}</div>
                      )} */}
                          <ErrorMessage
                            name="email_id"
                            component="small"
                            className="text-danger"
                          />
                        </div>
                      </div>

                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>
                            Contact Number : <Astrick color="red" size="13px" />
                          </b>
                        </label>
                        <div className="col-sm-4">
                          <Field
                            type="text"
                            className="form-control form-control-sm"
                            id="contact_no"
                            name="contact_no"
                            placeholder="Contact Number"
                            // defaultValue={data.contact_no}
                            minLength={10}
                            maxLength={10}
                            onKeyPress={(e) => {
                              Validation.NumbersOnly(e);
                            }}
                            // onChange={handleMobileValidation}
                            autoComplete="off"
                            // required
                          />
                          <ErrorMessage
                            name="contact_no"
                            component="small"
                            className="text-danger"
                          />
                        </div>
                      </div>
                      {/* {contactError && (
                    <small
                      style={{
                        color: 'red',
                        position: 'relative',
                        left: '12.375rem'
                      }}
                    >
                      {contactError}
                    </small>
                  )} */}
                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>Remark :</b>
                        </label>
                        <div className="col-sm-4">
                          <Field
                            type="text"
                            className="form-control form-control-sm"
                            id="remark"
                            name="remark"
                            // defaultValue={data && data.remark}
                            // maxLength={50}
                          />
                          <ErrorMessage
                            name="remark"
                            component="small"
                            className="text-danger"
                          />
                        </div>
                      </div>

                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>Status :</b>
                        </label>
                        <div className="col-sm-4">
                          <div className="row">
                            <div className="col-md-2">
                              <div className="form-check">
                                <Field
                                  className="form-check-input"
                                  type="radio"
                                  name="is_active"
                                  id="is_active_1"
                                  value="1"
                                  // defaultChecked={
                                  //   data && data.is_active === 1
                                  //     ? true
                                  //     : !data
                                  //     ? true
                                  //     : false
                                  // }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="is_active_1"
                                >
                                  Active
                                </label>
                              </div>
                            </div>{' '}
                            &nbsp; &nbsp;
                            <div className="col-md-1">
                              <div className="form-check">
                                <Field
                                  className="form-check-input"
                                  type="radio"
                                  name="is_active"
                                  id="is_active_0"
                                  value="0"
                                  // readOnly={(modal.modalData) ? false : true }
                                  // defaultChecked={
                                  //   data && data.is_active === 0 ? true : false
                                  // }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="is_active_0"
                                >
                                  Deactive
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
                            Address :<Astrick color="red" size="13px" />
                          </b>
                        </label>
                        <div className="col-sm-10">
                          <Field
                            as="textarea"
                            className="form-control form-control-sm"
                            id="address"
                            name="address"
                            placeholder="Enter maximum 250 character"
                            rows="3"
                            maxLength={250}
                            // onKeyDown={(e) => {
                            //   if (e.key !== 'Enter') {
                            //     Validation.addressField(e);
                            //   }
                            // }}
                            // required
                            // defaultValue={data.address}
                          />
                          <ErrorMessage
                            name="address"
                            component="small"
                            className="text-danger"
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
                          <Field
                            type="text"
                            className="form-control form-control-sm"
                            id="pincode"
                            name="pincode"
                            // defaultValue={data.pincode}
                            minLength={6}
                            maxLength={6}
                            onKeyPress={(e) => {
                              Validation.NumbersOnly(e);
                            }}
                            // required
                            autoComplete="off"
                          />
                          <ErrorMessage
                            name="pincode"
                            component="small"
                            className="text-danger"
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
                          {countryDropdown && data && (
                            <Field
                              options={countryDropdown}
                              component={Select}
                              id="country_id"
                              name="country_id"
                              // defaultValue={
                              //   data &&
                              //   countryDropdown &&
                              //   countryDropdown.filter(
                              //     (d) => d.value === data.country_id
                              //   )
                              // }
                              // onChange={handleCountryChange}
                              value={
                                data &&
                                countryDropdown &&
                                countryDropdown.find(
                                  (option) =>
                                    option.value === Number(values.country_id)
                                )
                              }
                              onChange={(option) => {
                                setFieldValue('state_id', null);
                                setFieldValue('city_id', null);
                                setFieldValue('country_id', option?.value);

                                handleCountryChange(option);
                              }}
                            />
                          )}
                          <ErrorMessage
                            name="country_id"
                            component="small"
                            className="text-danger"
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
                          {stateDropdown && data && (
                            <Select
                              options={stateDropdown}
                              id="state_id"
                              name="state_id"
                              // defaultValue={stateName}
                              // onChange={handleStateChange}
                              defaultValue={
                                data &&
                                stateDropdown &&
                                stateDropdown.find(
                                  (option) =>
                                    option.value === Number(values.state_id)
                                )
                              }
                              value={
                                values.state_id
                                  ? stateDropdown?.find(
                                      (item) =>
                                        item.value === Number(values.state_id)
                                    )
                                  : null // Ensure value is null if no match
                              }
                              // defaultValue={}
                              onChange={(option) => {
                                console.log(option);
                                setFieldValue('city_id', null);
                                setFieldValue('state_id', option?.value);

                                handleStateChange(option);
                              }}

                              // value={stateName}
                            />
                          )}
                          <ErrorMessage
                            name="state_id"
                            component="small"
                            className="text-danger"
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
                          {cityDropdown && data && (
                            <Select
                              options={cityDropdown}
                              id="city_id"
                              name="city_id"
                              // defaultValue={cityName}
                              // onChange={(e) => setCityName(e)}
                              defaultValue={
                                data &&
                                cityDropdown &&
                                cityDropdown.find(
                                  (option) =>
                                    option.value === Number(values.city_id)
                                )
                              }
                              value={
                                values.city_id
                                  ? cityDropdown?.find(
                                      (item) =>
                                        item.value === Number(values.city_id)
                                    )
                                  : null // Ensure value is null if no match
                              }
                              onChange={(option) => {
                                setFieldValue('city_id', option?.value);
                              }}
                              // value={cityName}
                            />
                          )}
                          <ErrorMessage
                            name="city_id"
                            component="small"
                            className="text-danger"
                          />
                        </div>
                      </div>
                    </div>
                    {/* CARD BODY*/}
                  </div>
                  {/* CARD */}

                  <div className="mt-3" style={{ textAlign: 'right' }}>
                    {checkRole && checkRole[0]?.can_update === 1 ? (
                      <button type="submit" className="btn btn-primary">
                        Update
                      </button>
                    ) : (
                      ''
                    )}
                    <Link
                      to={`/${_base}/Customer`}
                      className="btn btn-danger text-white"
                    >
                      Cancel
                    </Link>
                  </div>
                  {/* </form> */}
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditCustomer;
