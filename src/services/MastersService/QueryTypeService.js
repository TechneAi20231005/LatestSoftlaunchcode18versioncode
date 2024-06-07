//

// import axios from "axios";
// import {userSessionData} from '../../settings/constants';
// import {masterURL} from '../../settings/constants';

// const _URL=masterURL.queryType;

// const _getAllQueryType=_URL+"/getAllQueryType/"+userSessionData.tenantId;
// const _postQueryType=_URL+"/createQueryType";
// const _getQueryTypeById=_URL+"/getQueryTypeById/";
// const _updateQueryType=_URL+"/updateQueryType/";
// const _getQueryTypeForm=_URL+"/getQueryTypeForm/"+userSessionData.tenantId;

// export function getDateTime(){
//     var now = new Date();
//     let year=now.getFullYear();
//     let month=now.getMonth()+1;
//         month= month  >= 10 ?  month : `0${month}`
//     let day=now.getDate() >= 10 ? now.getDate() : `0${now.getDate()}`
//     let hour=now.getHours() >= 10 ? now.getHours() : `0${now.getHours()}`
//     let min=now.getMinutes() >= 10 ? now.getMinutes() : `0${now.getMinutes()}`
//     let sec=now.getSeconds() >= 10 ? now.getSeconds() : `0${now.getSeconds()}`
//      var datetime = year+'-'+month+'-'+day+' '+hour+':'+min+':'+sec;
//      return datetime;
//   }

// export default class QueryTypeService{

//     getQueryType(){
//         return axios.get(_getAllQueryType);
//     }

//      postQueryType(payload){
//         payload.append('tenant_id',userSessionData.tenantId);
//         payload.append('created_by',userSessionData.userId);
//         payload.append('created_at',getDateTime());
//         return axios.post(_postQueryType,payload)
//     }

//     getQueryTypeById(id){
//         return axios.get(_getQueryTypeById+id);
//     }

//     updateQueryType(id,payload){
//         payload.append('updated_by',userSessionData.userId);
//         payload.append('updated_at',getDateTime());
//         return axios.post(_updateQueryType+id,payload)
//     }

//     getQueryTypeForm(id){
//         return axios.get(_getQueryTypeForm+"/"+id)
//     }
// }

// import axios from "axios";
// import { userSessionData } from '../../settings/constants';
// import { masterURL } from '../../settings/constants';

// const _URL = masterURL.queryType;

// const _getAllQueryType = _URL + "/getAllQueryType1/" + userSessionData.tenantId;
// const _getAllQueryGroup = _URL + "/getAllQueryGroup/" + userSessionData.tenantId;
// const _postQueryType = _URL + "/createQueryType1";
// const _postQueryGroup = _URL + "/createQueryGroup";
// const _getQueryTypeById = _URL + "/getQueryTypeById/";
// const _updateQueryType = _URL + "/updateQueryType1/";
// const _getQueryTypeForm = _URL + "/getQueryTypeForm/" + userSessionData.tenantId;
// const _updateQueryGroup = _URL + "/updateQueryGroup/";

// export function getDateTime() {
//     var now = new Date();
//     let year = now.getFullYear();
//     let month = now.getMonth() + 1;
//     month = month >= 10 ? month : `0${month}`
//     let day = now.getDate() >= 10 ? now.getDate() : `0${now.getDate()}`
//     let hour = now.getHours() >= 10 ? now.getHours() : `0${now.getHours()}`
//     let min = now.getMinutes() >= 10 ? now.getMinutes() : `0${now.getMinutes()}`
//     let sec = now.getSeconds() >= 10 ? now.getSeconds() : `0${now.getSeconds()}`
//     var datetime = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
//     return datetime;
// }

// export default class QueryTypeService {

//     getQueryType() {
//         return axios.get(_getAllQueryType);
//     }

//     getAllQueryGroup() {
//         return axios.get(_getAllQueryGroup);
//     }

//     postQueryType(payload) {
//         payload.append('tenant_id', userSessionData.tenantId);
//         payload.append('created_by', userSessionData.userId);
//         payload.append('created_at', getDateTime());
//         return axios.post(_postQueryType, payload)
//     }

//     postQueryGroup(payload) {
//         payload.append('tenant_id', userSessionData.tenantId);
//         payload.append('created_by', userSessionData.userId);
//         payload.append('created_at', getDateTime());
//         return axios.post(_postQueryGroup, payload)
//     }

//     getQueryTypeById(id) {
//         return axios.get(_getQueryTypeById + id);
//     }

//     updateQueryType(id, payload) {
//         payload.append('updated_by', userSessionData.userId);
//         payload.append('updated_at', getDateTime());
//         return axios.post(_updateQueryType + id, payload)
//     }

//     updateQueryGroup(id, payload) {
//         payload.append('updated_by', userSessionData.userId);
//         payload.append('updated_at', getDateTime());
//         return axios.post(_updateQueryGroup + id, payload)
//     }

//     getQueryTypeForm(id) {
//         return axios.get(_getQueryTypeForm + "/" + id)
//     }
// }

// import axios from "axios";
// import {userSessionData} from '../../settings/constants';
// import {masterURL} from '../../settings/constants';

// const _URL=masterURL.queryType;

// const _getAllQueryType=_URL+"/getAllQueryType/"+userSessionData.tenantId;
// const _postQueryType=_URL+"/createQueryType";
// const _getQueryTypeById=_URL+"/getQueryTypeById/";
// const _updateQueryType=_URL+"/updateQueryType/";
// const _getQueryTypeForm=_URL+"/getQueryTypeForm/"+userSessionData.tenantId;

// export function getDateTime(){
//     var now = new Date();
//     let year=now.getFullYear();
//     let month=now.getMonth()+1;
//         month= month  >= 10 ?  month : `0${month}`
//     let day=now.getDate() >= 10 ? now.getDate() : `0${now.getDate()}`
//     let hour=now.getHours() >= 10 ? now.getHours() : `0${now.getHours()}`
//     let min=now.getMinutes() >= 10 ? now.getMinutes() : `0${now.getMinutes()}`
//     let sec=now.getSeconds() >= 10 ? now.getSeconds() : `0${now.getSeconds()}`
//      var datetime = year+'-'+month+'-'+day+' '+hour+':'+min+':'+sec;
//      return datetime;
//   }

// export default class QueryTypeService{

//     getQueryType(){
//         return axios.get(_getAllQueryType);
//     }

//      postQueryType(payload){
//         payload.append('tenant_id',userSessionData.tenantId);
//         payload.append('created_by',userSessionData.userId);
//         payload.append('created_at',getDateTime());
//         return axios.post(_postQueryType,payload)
//     }

//     getQueryTypeById(id){
//         return axios.get(_getQueryTypeById+id);
//     }

//     updateQueryType(id,payload){
//         payload.append('updated_by',userSessionData.userId);
//         payload.append('updated_at',getDateTime());
//         return axios.post(_updateQueryType+id,payload)
//     }

//     getQueryTypeForm(id){
//         return axios.get(_getQueryTypeForm+"/"+id)
//     }
// }

import axios from 'axios';
import { userSessionData } from '../../settings/constants';
import { masterURL } from '../../settings/constants';

const _URL = masterURL.queryType;

const _getAllQueryType = _URL + '/getAllQueryType1';
const _getAllQueryGroup = _URL + '/getAllQueryGroup';
const _postQueryType = _URL + '/createQueryType1';
const _postQueryGroup = _URL + '/createQueryGroup';
const _getQueryTypeById = _URL + '/getQueryTypeById/';
const _updateQueryType = _URL + '/updateQueryType1/';
const _getQueryTypeForm = _URL + '/getQueryTypeForm';
const _updateQueryGroup = _URL + '/updateQueryGroup/';

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

export default class QueryTypeService {
  getQueryType() {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(_getAllQueryType, config);
  }

  getAllQueryGroup(status) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    if (status) {
      return axios.get(_getAllQueryGroup + '/' + status, config);
    } else {
      return axios.get(_getAllQueryGroup, config);
    }
  }

  getQueryTypeMapped(id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(_URL + '/getQueryTypeMappedData/' + id, config);
  }

  postQueryType(payload) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    payload.append('tenant_id', userSessionData.tenantId);
    payload.append('created_by', userSessionData.userId);
    payload.append('created_at', getDateTime());
    return axios.post(_postQueryType, payload, config);
  }

  postQueryGroup(payload) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    payload.append('tenant_id', userSessionData.tenantId);
    payload.append('created_by', userSessionData.userId);
    payload.append('created_at', getDateTime());
    return axios.post(_postQueryGroup, payload, config);
  }

  getQueryTypeById(id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(_getQueryTypeById + id, config);
  }

  updateQueryType(id, payload) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    payload.append('updated_by', userSessionData.userId);
    payload.append('updated_at', getDateTime());
    return axios.post(_updateQueryType + id, payload, config);
  }

  updateQueryGroup(id, payload) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    payload.append('updated_by', userSessionData.userId);
    payload.append('updated_at', getDateTime());
    return axios.post(_updateQueryGroup + id, payload, config);
  }

  getQueryTypeForm(id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(_getQueryTypeForm + '/' + id, config);
  }
}
