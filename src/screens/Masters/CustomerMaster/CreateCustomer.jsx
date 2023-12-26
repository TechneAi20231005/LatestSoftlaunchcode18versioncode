import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorLogService from "../../../services/ErrorLogService";
import CustomerType from "../../../services/MastersService/CustomerTypeService";
import CustomerService from "../../../services/MastersService/CustomerService";
import CountryService from "../../../services/MastersService/CountryService";
import StateService from "../../../services/MastersService/StateService";
import CityService from "../../../services/MastersService/CityService";
import PageHeader from "../../../components/Common/PageHeader";
import Alert from "../../../components/Common/Alert";
import { Astrick } from "../../../components/Utilities/Style";
import * as Validation from "../../../components/Utilities/Validation";
import { _base } from "../../../settings/constants";
import Select from "react-select";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";

export default function CreateCustomer({ match }) {
  const history = useNavigate();
  const [notify, setNotify] = useState(null);
  const [data, setData] = useState(null);
  const [customerType, setCustomerType] = useState(null);
  const [dependent, setDependent] = useState({
    country_id: null,
    state_id: null,
  });

  const [country, setCountry] = useState(null);
  const [countryDropdown, setCountryDropdown] = useState(null);

  const [state, setState] = useState(null);
  const [stateDropdown, setStateDropdown] = useState(null);
  const [city, setCity] = useState(null);
  const [cityDropdown, setCityDropdown] = useState(null);

  const [updateStatus, setUpdateStatus] = useState({});

  const [stateName, setStateName] = useState(null);
  const [cityName, setCityName] = useState(null);
  const roleId = sessionStorage.getItem("role_id");
  const [checkRole, setCheckRole] = useState(null);
  const handleDependent = (e, name) => {
    console.log(e);
    setDependent({
      ...dependent,
      [name]: e.value,
    });
  };

  const [contactError, setContactError] = useState(null);
  const [contactErr, setContactErr] = useState(false);
  const [contactNumber, setContactNumber] = useState(null);
  const handleMobileValidation = (e) => {
    const contactNumber = e.target.value;
    setContactNumber(contactNumber);
    if (
      contactNumber.charAt(0) == "9" ||
      contactNumber.charAt(0) == "8" ||
      contactNumber.charAt(0) == "7" ||
      contactNumber.charAt(0) == "6"
    ) {
      if (/^[0]+$/.test(contactNumber)) {
        setContactErr(true);
        setContactError("Invalid Mobile Number");
      } else {
        setContactErr(false);
        setContactError("");
      }
    } else if (contactNumber.length === 10) {
      setContactErr(true);
      setContactError("Invalid Mobile Number");
    } else {
      setContactError("");
    }
  };

  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    var flag = 1;
    setNotify(null);

    var customerType = formData.getAll("customer_type_id");
    var selectEmail = formData.getAll("email_id");
    var selectCountry = formData.getAll("country_id");
    var selectState = formData.getAll("state_id");
    var selectCity = formData.getAll("city_id");

    if (
      customerType == "" ||
      selectEmail == "" ||
      selectCountry == "" ||
      selectState == "" ||
      selectCity == ""
    ) {
      flag = 0;
      setNotify(null);
      if (customerType == "") {
        // setNotify(null);
        alert("Please Select Customer Type");
        // setNotify({ type: 'danger', message: "Please Select Customer Type" });
      } else if (selectEmail == "") {
        // setNotify(null);
        alert("Please Select Email");
        // setNotify({ type: 'danger', message: "Please Select Customer Type" });
      } else if (selectCountry == "") {
        // setNotify(null);
        alert("Please Select Country");
        // setNotify({ type: 'danger', message: "Please Select Country" });
      } else if (selectState == "") {
        // setNotify(null);
        alert("Please Select State");
        // setNotify({ type: 'danger', message: "Please Select State" });
      } else if (selectCity == "") {
        // setNotify(null);
        alert("Please Select City");
        // setNotify({ type: 'danger', message: "Please Select City" });
      } else {
        // setNotify(null);
        alert("Please Check Form");
        // setNotify({ type: 'danger', message: "Please Check Form" });
      }
    }

    if (contactNumber.length < 10) {
      alert("Mobile Number Field should be 10 Digits");
      return false;
    } else {
      if (flag === 1) {
        await new CustomerService().postCustomer(formData)
          .then((res) => {
            if (res.status === 200) {
              if (res.data.status === 1) {
                history({
                  pathname: `/${_base}/Customer`,
                  state: {
                    alert: { type: "success", message: res.data.message },
                  },
                });
              } else {
                setNotify({ type: "danger", message: res.data.message });
              }
            } else {
              setNotify({ type: "danger", message: res.message });
              new ErrorLogService().sendErrorLog(
                "Customer",
                "Create_Customer",
                "INSERT",
                res.message
              );
            }
          })

          .catch((error) => {
            if (error.response) {
              const { response } = error;
              const { request, ...errorObject } = response;
              setNotify({ type: "danger", message: "Request Error !!!" });
              new ErrorLogService().sendErrorLog(
                "Customer",
                "Create_Customer",
                "INSERT",
                errorObject.data.message
              );
            } else {
              // Handle non-HTTP errors
              console.error("Non-HTTP error occurred:", error.message);
              setNotify({ type: "danger", message: "Non-HTTP error occurred" });
            }
          });
          
          // .catch((error) => {
          //   const { response } = error;
          //   const { request, ...errorObject } = response;
          //   setNotify({ type: "danger", message: "Request Error !!!" });
          //   new ErrorLogService().sendErrorLog(
          //     "Customer",
          //     "Create_Customer",
          //     "INSERT",
          //     errorObject.data.message
          //   );
          // });
      }
    }
  };

  const loadData = async () => {
    await new CustomerType().getCustomerType().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const data = res.data.data;
        setCustomerType(
          data
            .filter((d) => d.is_active == 1)
            .map((d) => ({ label: d.type_name, value: d.id }))
        );
      }
    });

    //  **************************Country load data**************************************
    await new CountryService().getCountrySort().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setCountry(res.data.data.filter((d) => d.is_active === 1));
          setCountryDropdown(
            res.data.data
              .filter((d) => d.is_active == 1)
              .map((d) => ({ value: d.id, label: d.country }))
          );
        }
      }
    });
    //  ************************** State load data**************************************
    await new StateService().getStateSort().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setState(res.data.data.filter((d) => d.is_active === 1));
          setStateDropdown(
            res.data.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({ value: d.id, label: d.state }))
          );
        }
      }
    });
    //  ************************** city load data**************************************
    await new CityService().getCity().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setCity(res.data.data.filter((d) => d.is_active === 1));
          setCityDropdown(
            res.data.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({ value: d.id, label: d.city }))
          );
        }
      }
    });


    await new ManageMenuService().getRole(roleId).then((res) => {
      if (res.status === 200) {
        // setShowLoaderModal(false);
        if (res.data.status == 1) {
          const getRoleId = sessionStorage.getItem("role_id");
          setCheckRole(res.data.data.filter(d => d.role_id == getRoleId))
        }
      }
    })
  };

  const handleCountryChange = (e) => {
    // setStateDropdown(state.filter(d => d.country_id == e.value).map(d => ({ value: d.id, label: d.state })))
    // const newStatus = { ...updateStatus, statedrp: 1 }
    // setUpdateStatus(newStatus)
    setStateDropdown(
      state
        .filter((d) => d.country_id == e.value)
        .map((d) => ({ value: d.id, label: d.state }))
    );
    const newStatus = { ...updateStatus, statedrp: 1 };
    setUpdateStatus(newStatus);
    setStateName(null);
    setCityName(null);
  };

  const handleStateChange = (e) => {
    // setCityDropdown(city.filter(d => d.state_id == e.value).map(d => ({ value: d.id, label: d.city })))
    // const newStatus = { ...updateStatus, citydrp: 1 }
    // setUpdateStatus(newStatus)

    setCityDropdown(
      city
        .filter((d) => d.state_id == e.value)
        .map((d) => ({ value: d.id, label: d.city }))
    );
    const newStatus = { ...updateStatus, citydrp: 1 };
    setUpdateStatus(newStatus);
    setStateName(e);
    setCityName(null);
  };

  const onTestChange = () => {
    var key = window.event.keyCode;

    // If the user has pressed enter
    if (key === 13) {
      document.getElementById("txtArea").value =
        document.getElementById("txtArea").value + "\n*";
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    if(checkRole && checkRole[3].can_create === 0){

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;  
    }
    loadData();
  }, [checkRole]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

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
                      className="form-control form-control-sm"
                      id="email_id"
                      name="email_id"
                      placeholder="Email Address"
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersSpeicalOnly(e);
                      }}
                      // onChange={handleEmail}
                      required
                      pattern="^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$"
                    />
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
                      color: "red",
                      position: "relative",
                      left: "12.375rem",
                    }}
                  >
                    {contactError}
                  </small>
                )}
              </div>{" "}
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
                      Address :<Astrick color="red" size="13px" />{" "}
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          // Perform any desired action when the Enter key is pressed
                          // Example: handleEnterKey();
                        } else {
                          Validation.addressFieldOnly(e);
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
                    style={{ textAlign: "right" }}
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
                      //defaultValue={modal.modalData ? countryDropdown.filter(d=>modal.modalData.country_id==d.value) : ""}
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
                        updateStatus.statedrp !== undefined ? stateDropdown : []
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
                    style={{ textAlign: "right" }}
                  >
                    <b>
                      City : <Astrick color="red" />
                    </b>
                  </label>

                  <div className="col-sm-4">
                    <Select
                      options={
                        updateStatus.citydrp !== undefined ? cityDropdown : []
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

            <div className="mt-3" style={{ textAlign: "right" }}>
              <button type="submit" className="btn btn-primary">
                Add
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
