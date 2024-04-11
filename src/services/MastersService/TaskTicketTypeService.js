import axios from "axios";
import { userSessionData } from "../../settings/constants";
import { masterURL } from "../../settings/constants";

const _URL = masterURL.taskTicketTypeMaster;

const _getAllType = _URL + "/getTaskTicketType";
const _getTaskTicketType = _URL + "/getTaskTicketTypeData/";

const _postType = _URL + "/createTaskTicketType";
const _getTypeById = _URL + "/getTaskTicketType/";
const _updateType = _URL + "/createTaskTicketType/";
const _getParent = _URL + "/getParent";
const _getTaskType = _URL + "/getTaskType";
const _getTicketType = _URL + "/getTicketType";

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

export default class TaskTicketTypeService {
  getAllType() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_getAllType, config);
  }

  getAllTaskTicketType(type) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_getTaskTicketType + type, config);
  }

  getTaskType() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_getTaskType, config);
  }

  getTicketType(payload) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_getTicketType, config);
  }

  getParent() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_getParent, config);
  }

  postType(payload) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.post(_postType, payload, config);
  }

  //  getStatusById(id){
  //     return axios.get(_getStatusById+id);
  // }
  _getTypeById(id) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_getTypeById + id, config);
  }

  _updateType(id, payload) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.post(_updateType + id, payload, config);
  }
}
