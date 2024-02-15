import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { _base } from "../../settings/constants";

import PageHeader from "../../components/Common/PageHeader";

import TenantService from "../../services/MastersService/TenantService";
import { Astrick } from "../../components/Utilities/Style";
import * as Validation from "../../components/Utilities/Validation";
import Select from "react-select";
import ManageMenuService from "../../services/MenuManagementService/ManageMenuService";
import CountryService from "../../services/MastersService/CountryService";
import StateService from "../../services/MastersService/StateService";
import CityService from "../../services/MastersService/CityService";
import Alert from "../../components/Common/Alert";
import {  useDispatch, useSelector } from "react-redux"
import { getCityData, getCountryDataSort, getStateData, getStateDataSort } from "../Dashboard/DashboardAction";
import { getRoles } from "../Dashboard/DashboardAction";
import { updatetenantData } from "./TenantConponentAction";

export default function EditTenant({ match }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cityDropdowns = useSelector((DashbordSlice) => DashbordSlice.dashboard.sortedCityData);
  const stateDropdowns = useSelector((DashbordSlice) => DashbordSlice.dashboard.filteredStateData);
  const countryDropdowns = useSelector((DashbordSlice) => DashbordSlice.dashboard.filteredCountryData);
  const checkRole=useSelector(DashbordSlice=>DashbordSlice.dashboard.getRoles.filter((d)=>d.menu_id==33))
  const [notify, setNotify] = useState();
  const [data, setData] = useState();
  const [toggleRadio, setToggleRadio] = useState(false);
  const { id } = useParams();

  const cityDropdown = useSelector((DashbordSlice) => DashbordSlice.dashboard.sortedCityData);
  const stateDropdown = useSelector((DashbordSlice) => DashbordSlice.dashboard.stateData);
  // const countryDropdown = useSelector((DashbordSlice) => DashbordSlice.dashboard.filteredCountryData);
  const [stateDropdownData, setStateDropdownData] = useState(false);
  const [cityDropdownData, setCityDropdownData] = useState(false);
  const CountryData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.filteredCountryData
  );

  const AllcityDropDownData = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.cityData
  );
  const tenanatId = id;
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
  const [country, setCountry] = useState(null);
  const [countryDropdown, setCountryDropdown] = useState(null);
  const [state, setState] = useState(null);
  // const [stateDropdown, setStateDropdown] = useState(null);
  const [city, setCity] = useState(null);
  // const [cityDropdown, setCityDropdown] = useState(null);

  const roleId = sessionStorage.getItem("role_id");
  // const [checkRole, setCheckRole] = useState(null);


  const [inputState, setInputState] = useState({
 
  });

  const [contactValid, setContactValid] = useState(false);

  const [contactNumber, setContactNumber] = useState(null);
  const handleContactValidation = (e) => {
    const contactValidation = e.target.value;
    console.log(contactValidation);

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
  const handleDependentChange = (e, type) => {
    if (type == "COUNTRY") {
      // setStateDropdown(
      //   state
      //     .filter((d) => d.country_id == e.value)
      //     .map((d) => ({ value: d.id, label: d.state }))
      // );
      setStateDropdownData(stateDropdown.filter((filterState) => filterState.country_id === e.value).map((d)=>({ value: d.id, label: d.state })))

    }
    if (type == "STATE") {
      // setCityDropdown(
      //   city
      //     .filter((d) => d.state_id == e.value)
      //     .map((d) => ({ value: d.id, label: d.city }))
      // );
      setCityDropdownData(AllcityDropDownData.filter((filterState) => filterState.state_id===e.value).map((d) => ({ value: d.id, label: d.city })))

    }
  };
  const loadData = async () => {

    dispatch(getCountryDataSort());
    dispatch(getRoles());
    dispatch(getStateDataSort())
    if(!stateDropdown){
      dispatch(getStateData());
    
    }
  

    dispatch(getCityData());
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
    // await new CityService().getCity().then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       setCity(res.data.data);
    //       setCityDropdown(
    //         res.data.data.map((d) => ({ value: d.id, label: d.city }))
    //       );
    //     }
    //   }
    // });
  
    await new TenantService().getTenantById(tenanatId).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          if (res?.data?.data?.is_active === 1) {
            setToggleRadio(true);
          } else {
            setToggleRadio(false);
          }
          setData(res.data.data);
        }
      }
    });

    // await new ManageMenuService().getRole(roleId).then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       const getRoleId = sessionStorage.getItem("role_id");
    //       setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
    //     }
    //   }
    // });
  };

  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("is_active", toggleRadio ? 1 : 0);
    setNotify(null);
    dispatch(updatetenantData({id:tenanatId,payload:formData})).then((res)=>{
   if(res.payload.data.status===1 &&res.payload.status===200){
    navigate(`/${_base}/TenantMaster`)
    
   }
    })

    // await new TenantService().updateTenant(tenanatId, formData).then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       history(
    //         {
    //           pathname: `/${_base}/TenantMaster`,
    //         },
    //         { state: { alert: { type: "success", message: res.data.message } } }
    //       );
    //     } else {

    //       setNotify({ type: "danger", message: res.data.message });
    //     }
    //   }
    // });
  };
  const handleRadios = (e) => {
    if (e === "active") {
      setToggleRadio(true);
    } else {
      setToggleRadio(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_update === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);
  return (
    <div className="container-xxl">

      {notify && <Alert alertData={notify} />}
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
              <div className="col-sm-10">
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
                  defaultValue={
                    data &&
                    companyType
                      .filter((d) => d.value == data.company_type)
                      .map((d) => ({ label: d.label, value: d.value }))
                  }
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
                  type="email"
                  className="form-control form-control-sm"
                  id="email_id"
                  name="email_id"
                  placeholder="Email Address"
                  required
                  defaultValue={data && data.email_id}
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
                  style={{ textAlign: "right" }}
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
                        CountryData.filter((d) => d.value == data.country)
                      }
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
                  {stateDropdownData && data && (
                    <Select
                      options={stateDropdownData}
                      id="state_id"
                      name="state_id"
                      defaultValue={
                        data &&
                        stateDropdown &&
                        stateDropdown.filter((d) => d.value == data.state)
                      }
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
                  {cityDropdown && data && (
                    <Select
                      options={cityDropdown}
                      id="city_id"
                      name="city_id"
                      defaultValue={
                        data &&
                        cityDropdown &&
                        cityDropdown.filter((d) => d.value == data.city)
                      }
                      onChange={(e) => handleDependentChange(e, "CITY")}
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

            <div className="mt-3" style={{ textAlign: "right" }}>
              {checkRole && checkRole[0]?.can_update === 1 ? (
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              ) : (
                ""
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
