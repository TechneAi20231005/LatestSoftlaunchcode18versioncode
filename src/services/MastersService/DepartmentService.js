import axios from "axios";
import { userSessionData } from "../../settings/constants";
import { masterURL } from "../../settings/constants";

const _URL = masterURL.department;

const _allDepartment = _URL + "/getAllDepartment"
const _createDepartment = _URL + "/createDepartment";
const _updateDepartment = _URL + "/updateDepartment/";
const _getDepartmentById = _URL + "/getDepartmentById/";

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

export default class DepartmentService {
  //  getDepartment(){
  //     return axios.get(_allDepartment);
  // }

  getDepartment() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_allDepartment, config);
  }

  postDepartment(payload) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    payload.append("tenant_id", userSessionData.tenantId);
    payload.append("created_by", userSessionData.userId);
    payload.append("created_at", getDateTime());
    // return axios.post(_createDepartment,payload)

    return axios.post(_createDepartment, payload, config);
  }

  //  getDepartmentById(id){
  //     return axios.get(_getDepartmentById+id);
  // }

  getDepartmentById(id) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_getDepartmentById + id, config);
  }

  updateDepartment(id, payload) {
    payload.append("updated_by", userSessionData.userId);
    payload.append("updated_at", getDateTime());
    // return axios.post(_updateDepartment+id,payload)
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.post(_updateDepartment + id, payload, config);
  }
}
