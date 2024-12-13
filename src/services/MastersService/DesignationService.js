import axios from 'axios';
import { userSessionData } from '../../settings/constants';
import { masterURL } from '../../settings/constants';

const _URL = masterURL.designation;

const _getAllDesignation = `${_URL}/getData?export=1`;
// _URL + '/getAllDesignation/1';
const _createDepartment = _URL + '/createDesignations';
const _updateDesignation = _URL + '/createDesignations/';
const _getDesignationById = _URL + '/getDesignationById/';

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
    year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
  return datetime;
}

// const getTime =()=>{
//     var now = new Date()
//     let year=now.getFullYear();
//     let month=now.getMonth()+1;
//         month= month  >= 10 ?  month : `0${month}`
//     let day=now.getDate() >= 10 ? now.getDate() : `0${now.getDate()}`

//     let hour=now.getHours() >= 10 ? now.getHours() : `0${now.getHours()}`
//     let min=now.getMinutes() >= 10 ? now.getMinutes() : `0${now.getMinutes()}`
//     let sec=now.getSeconds() >= 10 ? now.getSeconds() : `0${now.getSeconds()}`

//     var datetime = hour+':'+min+':'+sec;
//     return datetime;
// }
// const time = getTime();

export default class DesignationService {
  //  getDesignation(){
  //     return axios.get(_getAllDesignation);
  // }

  getDesignation() {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(_getAllDesignation, config);
  }

  getdesignatedDropdown() {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(_URL + '/getdesignatedDropdown', config);
  }

  getDesignation() {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(_getAllDesignation, config);
  }

  // getdesignatedDropdown(){

  //     return axios.get(_URL +"/getdesignatedDropdown");
  // }

  getdesignatedDropdown() {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(_URL + '/getdesignatedDropdown', config);
  }
  postDesignation(payload) {
    payload.append('tenant_id', userSessionData.tenantId);
    payload.append('created_by', userSessionData.userId);
    payload.append('created_at', getDateTime());
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.post(_createDepartment, payload, config);
  }

  getDesignationById(id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(_getDesignationById + id, config);
  }

  updateDesignation(id, payload) {
    payload.append('updated_by', userSessionData.userId);
    payload.append('updated_at', getDateTime());
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.post(_updateDesignation + id, payload, config);
  }
}
