import axios from "axios";
import { userSessionData } from "../../settings/constants";
import { settingMasterUrl } from "../../settings/constants";
// import {getDateTime} from '../../components/Utilities/Functions'

const _URL = settingMasterUrl.customerMapping;

const _getAllCustomerMapping = _URL + "/getAllCustomerMapping";
const _getExportData = _URL + "/getExportCustomerMapping";
const _createCustomerMapping = _URL + "/createCustomerMapping";
const _getCustomerMappingById = _URL + "/getCustomerMappingById";
const _updateCustomerMapping = _URL + "/updateCustomerMapping/";
const _priorityDropdown = _URL + "/priorityDropdown";
const _exportCustomerMapping = _URL + "/getExportCustomerMapping";

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
export default class CustomerMapping {
  getCustomerMapping() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_getAllCustomerMapping, config);
  }

  exportCustomerMapping() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_exportCustomerMapping, config);
  }

  gerExportData() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_getExportData, config);
  }

  getPriorityDropdown() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_priorityDropdown, config);
  }

  postCustomerMapping(payload) {
    // payload.append("tenant_id", sessionStorage.getItem("tenant_id"));
    // payload.append("created_by", userSessionData.userId);
    // payload.append("created_at", getDateTime());
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(_createCustomerMapping, payload, config);
  }

  getCustomerMappingById(id) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_getCustomerMappingById + "/" + id, config);
  }

  updateCustomerMapping(id, payload) {
    // payload.append("tenant_id", sessionStorage.getItem("tenant_id"));
    // payload.append("updated_by", userSessionData.userId);
    // payload.append("updated_at", getDateTime());
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(_updateCustomerMapping + id, payload, config);
  }

  getCustomerMappingSettings(query_type_id = "") {
    const tenant_id = sessionStorage.getItem("tenant_id");
    const user_id = sessionStorage.getItem("id");
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_URL + "/getCustomerMappingSettings/" + user_id, config);
  }

  getCustomerMappingDynamicForm(query_type_id) {
    const tenant_id = sessionStorage.getItem("tenant_id");
    const user_id = sessionStorage.getItem("id");
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(
      _URL + "/getCustomerMappingDynamicForm/" + user_id + "/" + query_type_id,
      config
    );
  }
  // getQueryTypeCustomerMapping(id,payload){
  //     const tenant_id=localStorage.getItem('tenant_id');
  //     return axios.get(_URL+"/getQuertyTypeCustomerMapping/"+tenant_id)
  // }

  // getUser(query_type_id=""){
  //     const tenant_id=localStorage.getItem('tenant_id');

  //     if(query_type_id){
  //         return axios.get(_URL+"/getUser/"+tenant_id+"/"+query_type_id);
  //     }else{
  //         return axios.get(_URL+"/getUser/"+tenant_id);
  //     }
  // }
}
