import axios from 'axios';
import { userSessionData } from '../../settings/constants';
import { masterURL } from '../../settings/constants';

const _URL = masterURL.status;

const _getAllStatus = `${_URL}/getData?export=1`;
//  _URL + '/getData';
const _postStatus = _URL + '/createStatus';
const _getStatusById = _URL + '/getStatusById/';
const _updateStatus = _URL + '/createStatus/';

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

export default class StatusService {
  // getStatus(){
  //     return axios.get(_getAllStatus);
  // }

  getStatus(id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(_getAllStatus, config);
  }

  postStatus(payload) {
    payload.append('tenant_id', userSessionData.tenantId);
    payload.append('created_by', userSessionData.userId);
    payload.append('created_at', getDateTime());
    // return axios.post(_postStatus,payload)
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.post(_postStatus, payload, config);
  }

  //  getStatusById(id){
  //     return axios.get(_getStatusById+id);
  // }
  getStatusById(id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(_getStatusById + id, config);
  }

  updateStatus(id, payload) {
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
    // return axios.post(_updateStatus+id,payload)

    return axios.post(_updateStatus + id, payload, config);
  }
}
