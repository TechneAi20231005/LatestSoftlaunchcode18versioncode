import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { _base } from "../../settings/constants";

import PageHeader from "../../components/Common/PageHeader";
import ErrorLogService from "../../services/ErrorLogService";
import TenantService from "../../services/MastersService/TenantService";
import Alert from "../../components/Common/Alert";
import { Astrick } from "../../components/Utilities/Style";
import * as Validation from "../../components/Utilities/Validation";
import Select from "react-select";

import CountryService from "../../services/MastersService/CountryService";
import StateService from "../../services/MastersService/StateService";
import CityService from "../../services/MastersService/CityService";
import ManageMenuService from "../../services/MenuManagementService/ManageMenuService";
import { useDispatch, useSelector } from "react-redux";
import { getAllTenant } from "./TenantConponentAction";


import {
  getCityData,
  getCountryDataSort,
  getRoles,
  getStateData,
  getStateDataSort,

} from "../Dashboard/DashboardAction";
import DashbordSlice from "../Dashboard/DashbordSlice";
import { posttenantData } from "./TenantConponentAction";
import { tenantmasterSlice, handleError } from "./TenantComponentSlice";

export default function CreateTenant({ match }) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cityDropdown = useSelector((DashbordSlice) => DashbordSlice.dashboard.sortedCityData);
  const stateDropdown = useSelector((DashbordSlice) => DashbordSlice.dashboard.stateData);
  // const countryDropdown = useSelector((DashbordSlice) => DashbordSlice.dashboard.filteredCountryData);
  const checkRole = useSelector(DashbordSlice => DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id == 33))
  const CountryData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.filteredCountryData
  );

  const AllcityDropDownData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.cityData
  );

  const notify = useSelector(TenantComponentSlice => TenantComponentSlice.tenantMaster.notify
  );



  const roleId = sessionStorage.getItem("role_id");
  // const [checkRole, setCheckRole] = useState(null);
  const isMasterAdmin = localStorage.getItem("role_name");
  const companyType = [
    { label: "Private Limited Company", value: "Private Limited Company" },
    { label: "Public limited company", value: "Public limited company" },
    {
      label: "Limited liability partnership ",
      value: "Limited liability partnership ",
    },
    {
      label: "Property management company",
      value: "Property management company",
    },
    {
      label: "Community Interest Company",
      value: "Community Interest Company",
    },
  ];
  // const [country, setCountry] = useState(null);
  // const [countryDropdown, setCountryDropdown] = useState(null);
  const [state, setState] = useState(null);
  // const [stateDropdown, setStateDropdown] = useState(null);
  const [city, setCity] = useState(null);
  // const [cityDropdown, setCityDropdown] = useState(null);
  const [stateDropdownData, setStateDropdownData] = useState(false);
  const [cityDropdownData, setCityDropdownData] = useState(false);

  const handleDependentChange = (e, type) => {
    if (type == "COUNTRY") {
      // setStateDropdown(
      //   state
      //     .filter((d) => d.country_id == e.value)
      //     .map((d) => ({ value: d.id, label: d.state }))
      // );
      setStateDropdownData(stateDropdown.filter((filterState) => filterState.country_id === e.value).map((d) => ({ value: d.id, label: d.state })))

    }
    if (type == "STATE") {
      // setCityDropdown(
      //   city
      //     .filter((d) => d.state_id == e.value)
      //     .map((d) => ({ value: d.id, label: d.city }))
      // );
      setCityDropdownData(AllcityDropDownData.filter((filterState) => filterState.state_id === e.value).map((d) => ({ value: d.id, label: d.city })))

    }
  };

  const [inputState, setInputState] = useState({

  });

  const [contactValid, setContactValid] = useState(false);

  const [contactNumber, setContactNumber] = useState(null);
  const handleContactValidation = (e) => {
    const contactValidation = e.target.value;


    if (contactValidation.length === 0) {
      setInputState({
        ...state,
        contactNoErr: "",
      });
      return;
    }
    if (
      contactValidation.charAt(0) == "9" ||
      contactValidation.charAt(0) == "8" ||
      contactValidation.charAt(0) == "7" ||
      contactValidation.charAt(0) == "6"
    ) {
      setInputState({ ...state, contactNoErr: "" });
      setContactValid(false);
    } else {
      setContactValid(true);
    }

    if (contactValidation.includes("000000000")) {
      setInputState({
        ...state,
        contactNoErr: "System not accepting 9 Consecutive Zeros here.",
      });
      setContactValid(true);
    }

    if (contactValidation.length < 10) {
      if (contactValidation.length === 0) {
        setInputState({
          ...state,
          contactNoErr: "please enter Mobile Number",
        });
        setContactValid(true);
      }
      setInputState({
        ...state,
        contactNoErr: "Invalid Mobile Number",
      });
      setContactValid(true);
    }

    if (contactValidation.length < 11) {
      setContactNumber(contactValidation);
    }
  };

  const loadData = async () => {
    // await new CountryService().getCountry().then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       setCountry(res.data.data);
    //       setCountryDropdown(
    //         res.data.data.map((d) => ({ value: d.id, label: d.country }))
    //       );
    //     }
    //   }
    // });
    dispatch(getCountryDataSort());
    dispatch(getRoles());
    dispatch(getStateDataSort());
    dispatch(getCityData());
    dispatch(getStateData());

    // await new ManageMenuService().getRole(roleId).then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       const getRoleId = sessionStorage.getItem("role_id");
    //       setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
    //     }
    //   }
    // });

    // await new StateService().getState().then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       setState(res.data.data);
    //       setStateDropdown(
    //         res.data.data.map((d) => ({ value: d.id, label: d.state }))
    //       );
    //     }
    //   }
    // });
    //   await new CityService().getCity().then((res) => {
    //     if (res.status === 200) {
    //       if (res.data.status == 1) {
    //         setCity(res.data.data);
    //         setCityDropdown(
    //           res.data.data.map((d) => ({ value: d.id, label: d.city }))
    //         );
    //       }
    //     }
    //   });
    // };
  };
  const handleForm = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    // setNotify(null);
    // await new TenantService().postTenant(formData).then((res) => {
    //   if (res.status === 200) {
    //     console.log("tenant");
    //     if (res.data.status == 1) {
    //       console.log("tenant1");
    //       history(
    //         {
    //           pathname: `/${_base}/TenantMaster`,
    //         },
    //         { state: { alert: { type: "success", message: res.data.message } } }
    //       );
    //     } else {
    //       console.log("tenant2", res);
    //       setNotify({ type: "danger", message: res?.data?.message });
    //     }
    //   }
    // });

    dispatch(posttenantData(formData)).then((res) => {

      if (res?.payload?.data?.status === 1 && res?.payload?.status === 200) {

        navigate(`/${_base}/TenantMaster`);
        dispatch(getAllTenant())
        dispatch(handleError({ type: "success", message: res.payload.data.message }))


      } else {
        dispatch(handleError({ type: "danger", message: res.payload.data.message }))
      }
    });
  };



  useEffect(() => {
    if (isMasterAdmin !== "MasterAdmin") {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
    loadData();
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_create === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      {notify && (
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
          </div>

          <div className="form-group row mt-2">
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
                onKeyPress={e => { Validation.emailOnly(e) }}
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
                    color: "red",
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
                style={{ textAlign: "right" }}
              >
                <b>Country : </b>
              </label>
              <div className="col-sm-4">
                {CountryData && (
                  <Select
                    options={CountryData}
                    id="country_id"
                    name="country_id"
                    onChange={(e) => handleDependentChange(e, "COUNTRY")}
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
                    onChange={(e) => handleDependentChange(e, "STATE")}
                  />
                )}
              </div>

              <label
                className="col-sm-2 col-form-label"
                style={{ textAlign: "right" }}
              >
                <b>City : </b>
              </label>

              <div className="col-sm-4">
                {cityDropdownData && (
                  <Select
                    options={cityDropdownData}
                    id="city_id"
                    name="city_id"
                    onChange={(e) => handleDependentChange(e, "CITY")}
                  />
                )}
              </div>
            </div>
          </div>
          {/* CARD BODY*/}

          <div className="mt-3" style={{ textAlign: "right" }}>
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
