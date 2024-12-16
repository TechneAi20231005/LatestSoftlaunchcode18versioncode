import axios from 'axios';
import { userSessionData } from '../../settings/constants';
import { masterURL } from '../../settings/constants';

const _URL = masterURL.state;

const _allState = `${_URL}/getData?export=1`;
const _allStateSort = `${_URL}/getData?type=1`;

const _postState = _URL + '/postData';
const _getStateById = _URL + '/getStateById/';
const _updateState = _URL + '/postData/';

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

export default class StateService {
  //  getState(){
  //     return axios.get(_allState);
  // }

  getState() {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(_allState, config);
  }

  getStateSort() {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(_allStateSort, config);
  }

  // getStateSort(){
  //     return axios.get(_allStateSort);
  // }

  postState(payload) {
    payload.append('tenant_id', userSessionData.tenantId);
    payload.append('created_by', userSessionData.userId);
    payload.append('created_at', getDateTime());
    // return axios.post(_postState,payload)

    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.post(_postState, payload, config);
  }

  getStateById(id) {
    return axios.get(_getStateById + id);
  }

  updateState(id, payload) {
    payload.append('updated_by', userSessionData.userId);
    payload.append('updated_at', getDateTime());
    // return axios.post(_updateState+id,payload)

    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.post(_updateState + id, payload, config, id);
  }
}
