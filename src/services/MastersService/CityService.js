import axios from "axios";
import { userSessionData } from "../../settings/constants";
import { masterURL } from "../../settings/constants";

const _URL = masterURL.city;

const _getAllCity = _URL + "/getAllCity";

// const _getAllCity = _URL + "/getAllCity/" + userSessionData.tenantId;
const _getAllCitySort =_URL + "/getAllCity/" ;
const _createCity = _URL + "/createCity";
const _getCityById = _URL + "/getCityById/";
const _updateCity = _URL + "/updateCity/";

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

export default class CityService {
  
  
  getCity() {
    const token = localStorage.getItem("jwt_token");
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
  
    return axios.get(_getAllCity, config);
  }
  


  

  getgetCitySortCity() {
    const token = localStorage.getItem("jwt_token");
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
  
    return axios.get(_getAllCitySort, config);
  }

  // getCitySort() {
  //   return axios.get(_getAllCitySort);
  // }

  postCity(payload) {
    payload.append("tenant_id", userSessionData.tenantId);
    payload.append("created_by", userSessionData.userId);
    payload.append("created_at", getDateTime());

    const token = localStorage.getItem("jwt_token");
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.post(_createCity, payload, config);
  }



  getCityById(id) {
    const token = localStorage.getItem("jwt_token");
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    
    return axios.get(_getCityById + id,config);
  }

  updateCity(id, payload) {
    payload.append("updated_by", userSessionData.userId);
    payload.append("updated_at", getDateTime());
    // return axios.post(_updateCity + id, payload);

    const token = localStorage.getItem("jwt_token");
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.post(_updateCity+id, payload, config,id);
  }
  }

