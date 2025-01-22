import axios from 'axios';
import { masterURL, userSessionData } from '../../settings/constants';
import { getDateTime } from '../../components/Utilities/Functions';
import {
  REACT_APP_API_URL,
  REACT_APP_PIN_CODE_API_URL,
  REACT_APP_ATTACHMENT_URL,
  REACT_APP_ROOT_URL,
  REACT_APP_API_REWAMP_BASE_URL
} from '../../config/envConfig';
const _URL = masterURL.user;

const _rewampApiUrl = REACT_APP_API_REWAMP_BASE_URL;

export default class UserService {
  // getUser(){
  //     return axios.get(_URL);
  // }
  getUser() {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(
      _rewampApiUrl + 'employeeMaster' + '/getData?export=1',
      config
    );
  }

  // getExportTicket() {
  //   const token = localStorage.getItem("jwt_token");

  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //   };

  //   const url = `${_URL}?type=EXPORT`

  //   return axios.get(url, config);

  // }

  getExportTicket() {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    // const url = `${_URL}?type=EXPORT`

    return axios.get(
      _rewampApiUrl + 'employeeMaster' + '/getData?export=1',
      config
    );
  }

  getUserForMyTickets(queryParams) {
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    const url = `${_rewampApiUrl}employeeMaster/getData?input_required=${queryParams}`;

    return axios.get(url, config);
  }

  // getUsers(id){
  //     return axios.get(_URL+"/except/"+id);
  // }

  getUsers(id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(_URL + '/except/' + id, config);
  }

  getUserWithMultipleDepartment(departmentId) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    if (departmentId) {
      return axios.get(
        _URL + '/getUserWithMultipleDepartment/' + departmentId,
        config
      );
    } else return axios.get(_URL + '/getUserWithMultipleDepartment', config);
  }

  postUser(payload) {
    payload.append('tenant_id', userSessionData.tenantId);
    payload.append('created_by', localStorage.getItem('id'));
    payload.append('created_at', getDateTime());
    // return axios.post(_URL, payload);

    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.post(
      _rewampApiUrl + 'employeeMaster' + '/postData',
      payload,
      config
    );
  }

  //   getUserById(id) {
  //     return axios.get(_URL + "/" + id);
  //   }

  getUserById(id) {
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(
      _rewampApiUrl + 'employeeMaster' + '/getData/' + id,
      config
    );
  }

  updateUser(id, payload) {
    payload.append('tenant_id', userSessionData.tenantId);
    payload.append('updated_by', localStorage.getItem('id'));
    payload.append('updated_at', getDateTime());
    // return axios.post(_URL + "/" + id, payload);

    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.post(
      _rewampApiUrl + 'employeeMaster' + '/postData' + '/' + id,
      payload,
      config
    );
  }

  updateAccountDetails(id, payload) {
    payload.append('updated_by', localStorage.getItem('id'));
    payload.append('updated_at', getDateTime());
    // return axios.post(_URL + "/updateAccountDetails/" + id, payload);
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        // "Content-Type": "application/json",
        'Content-Type': 'multipart/form-data'
      }
    };

    return axios.post(
      _rewampApiUrl + 'employeeMaster' + '/postData/' + id,
      payload,
      config
    );
  }

  updatePasswordDetails(id, payload) {
    payload.append('updated_by', localStorage.getItem('id'));
    payload.append('updated_at', getDateTime());
    // return axios.post(_URL + "/updatePasswordDetails/" + id, payload);
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.post(_URL + '/updatePasswordDetails/' + id, payload, config);
  }
}
