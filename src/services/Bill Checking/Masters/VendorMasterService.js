import axios from "axios";
import { userSessionData } from "../../../settings/constants";
import { billCheckingMasterUrl, masterURL } from "../../../settings/constants";
import { deleteAttachment } from "../../OtherService/AttachmentService";

const _URL = billCheckingMasterUrl.billChecking;
const URL = masterURL.city;
const __URL = masterURL.country;
const ___URL = masterURL.state;

const _getVendors = _URL + "/getVendorMaster/" + userSessionData.userId;
const _updateVendors = _URL + "/updateVendorMaster/";
const _getCity = URL + "/getAllCity/" + userSessionData.userId;
const _getPaymentTemplate =
  _URL + "/getPaymentTemplate/" + userSessionData.userId;
const _getCountry = __URL + "/getAllCountry/" + userSessionData.userId;
const _getState = ___URL + "/getAllState/" + userSessionData.userId;
const bulkUpload = _URL + "/bulkUploadVendor";
const downloadFromat = _URL + "/bulkFormat";

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

export default class VendorMasterService {
  getVendors() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_getVendors, config);
  }

  downloadBulkFormat() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(downloadFromat, config);
  }

  bulkUploadVendor(payload) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };
    return axios.post(bulkUpload, payload, config);
  }

  getVendorMasterById(id) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_URL + "/getVendorMasterById/" + id, config);
  }

  createVendor(payload) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };

    payload.append("tenant_id", userSessionData.tenantId);
    payload.append("created_by", userSessionData.userId);
    payload.append("created_at", getDateTime());
    return axios.post(_URL + "/createVendorMaster", payload, config);
  }

  updateVendor(id, payload) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };
    payload.append("updated_by", userSessionData.userId);
    payload.append("updated_at", getDateTime());
    return axios.post(_updateVendors + id, payload, config);
  }

  getActiveCity() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_getCity, config);
  }
  getActiveCountry() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_getCountry, config);
  }

  getActiveState() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_getState, config);
  }

  getActiveCountry() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_getCountry, config);
  }

  // getActiveState(){
  //     return axios.get(_getState);
  // }

  getActiveState() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_getState, config);
  }
  getActivePaymentTemplate() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_getPaymentTemplate, config);
  }

  deleteAttachmentById(attachment_id) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(
      `http://3.108.206.34/3_SoftLaunch/TSNewBackend/public/api/billCheckingMaster/deleteAttachment/${attachment_id}`,
      config
    );
  }
}
