import axios from "axios";
import { masterURL, userSessionData } from "../../settings/constants";

const _URL = masterURL.template;
const _getAllTemplate = _URL + "/getAllTemplate";
const _createTemplate = _URL + "/createTemplate";
const _getTemplateById = _URL + "/getTemplateById/";
const _exportData = _URL + "/getTemplateExport";
console.log(_exportData)
const _updateTemplate = _URL + "/updateTemplate/";

const _updateTask = _URL + "/updateTask/";
const _deleteTask = _URL + "/deleteTask/";
const _addBasket =_URL + "/createBasket/";
const _addTask =_URL + "/createTask/" ;
export default class TemplateService {
  getTemplate() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_getAllTemplate, config);
  }

  exporttempData() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_exportData, config);
  }

  postTemplate(payload) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(_createTemplate,payload, config);
  }

  getTemplateById(id) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_getTemplateById + id, config);
  }

  updateTemplate(id, payload) {
   
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(
      _createTemplate +"/"+ id,
      payload,
      config
    );
  }

  updateTask(id, payload) {
    payload = {
      ...payload,
      updated_by: userSessionData.userId,
      updated_at: userSessionData.time,
    };
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(
      _updateTask + id,
      payload,
      config
    );
  }
  addBasketinEdit(id,payload){
    const token = localStorage.getItem("jwt_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(
      _addBasket + id,
      payload,
      config
    );
  }

  addTaskinBasket(templateId,basketId,payload){
    const token = localStorage.getItem("jwt_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(
      _addTask + templateId +"/" +basketId,
      payload,
      config
    );
  }
  deleteTask(id, payload) {
    payload = {
      ...payload,
      updated_by: userSessionData.userId,
      updated_at: userSessionData.time,
    };
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(
      _deleteTask + id,
      payload,
      config
    );
  }
}

// export function getData() {
//   return axios.get(_URL);
// }

// export function postData(payload) {
//   payload = {
//     ...payload,
//     created_by: localStorage.getItem("id"),
//     created_at: getDateTime(),
//   };
//   return axios.post(_URL, payload, {
//     "Content-Type": "application/json",
//   });
// }

// export function getDataUsingParam(id) {
//   return axios.get(_URL + "/" + id);
// }

// export function updateTask(id, payload) {
//   payload = {
//     ...payload,
//     updated_by: localStorage.getItem("id"),
//     updated_at: getDateTime(),
//   };
//   return axios.post(_URL + "/updateTask/" + id, payload, {
//     "Content-Type": "application/json",
//   });
// }

// export function deleteTask(id, payload) {
//   payload = {
//     ...payload,
//     updated_by: localStorage.getItem("id"),
//     updated_at: getDateTime(),
//   };
//   return axios.post(_URL + "/deleteTask/" + id, payload, {
//     "Content-Type": "application/json",
//   });
// }
