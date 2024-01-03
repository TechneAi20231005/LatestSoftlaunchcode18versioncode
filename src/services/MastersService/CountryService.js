import axios from "axios";
import { userSessionData } from "../../settings/constants";
import { masterURL } from "../../settings/constants";
export const _apiUrl = "http://3.108.206.34/3_SoftLaunch/TSNewBackend/public/api";


const _URL = masterURL.country;

const _getAllCountry = _URL + "/getAllCountry";
const _getAllCountrySort = _URL + "/getAllCountry/1/1";
const _postCountry = _URL + "/createCountry";
const _roleType =_apiUrl+ "/billCheckingMaster/getDropdowns";
const _salarySlip=_apiUrl+"/salarySlip";

const _getCountryById = _URL + "/getCountryById/";
const _updateCountry = _URL + "/updateCountry/";

export function getDateTime() {
  var now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  month = month >= 10 ? month : `0${month}`;
  let day = now.getDate() >= 10 ? now.getDate() : `0${now.getDate()}`;
  let hour = now.getHours() >= 10 ? now.getHours() : `0${now.getHours()}`;
  let min = now.getMinutes() >= 10 ? now.getMinutes() : `0${now.getMinutes()}`;
  let sec = now.getSeconds() >= 10 ? now.getSeconds() : `0${now.getSeconds()}`;
  var datetime =
    year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
  return datetime;
}

export default class CountryService {
  // getCountry() {
  //     return axios.get(_getAllCountry);
  // }

  getCountry() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_getAllCountry, config);
  }

  getCountrySort() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_getAllCountrySort, config);
  }

  getRoleType() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const used_for = "on_roll_type"
    return axios.post(_roleType,{used_for}, config);
  }


  salarySlip(payload) {
    const token = localStorage.getItem("jwt_token");
    // const payload = {

    //   month: data.get("month"),
    //   year: data.get("year"),
    //   on_roll_type: data.get("on_roll_type")
    // };
    

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
 
    return axios.post(_salarySlip,payload, config);
  }
  

  








  

  // getCountrySort() {
  //     return axios.get(_getAllCountrySort);
  // }

  postCountry(payload) {
    payload.append("tenant_id", userSessionData.tenantId);
    payload.append("created_by", userSessionData.userId);
    payload.append("created_at", getDateTime());

    // return axios.post(_postCountry, payload)

    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.post(_postCountry, payload, config);
  }

  getCountryById(id) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_getCountryById + id, config);
  }

  updateCountry(id, payload) {
    payload.append("updated_by", userSessionData.userId);
    payload.append("updated_at", getDateTime());
    // return axios.post(_updateCountry + id, payload)

    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.post(_updateCountry + id, payload, config, id);
  }
}
