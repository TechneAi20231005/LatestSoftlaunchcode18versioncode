import axios from 'axios';
import { userSessionData } from '../../../settings/constants';
import { billCheckingMasterUrl } from '../../../settings/constants';

const _URL = billCheckingMasterUrl.billChecking;
const _getBillTypeDataDropdown =
  _URL + '/getBillTypeData/' + userSessionData.userId;
const _getVendors = _URL + '/getVendorMaster/' + userSessionData.userId;

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

export default class BillCheckingTransactionService {
  createModuleAuthorityUserSetting(payload) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    // payload.append("updated_by", userSessionData.userId);
    // payload.append("updated_at", getDateTime());

    return axios.post(
      _URL + '/createModuleAuthorityUserSetting',
      payload,
      config
    );
  }
  createModuleAuthority(payload) {
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
    return axios.post(_URL + '/createModuleAuthority', payload, config);
  }

  getModuleSetting() {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(
      _URL + '/getModuleSetting/' + userSessionData.userId,
      config
    );
  }

  // getUpdatedAuthorities(){
  //   const token=localStorage.getItem("jwt_token")
  //   const config={
  //     headers:{
  //       Authorization:`Bearer ${token}`,
  //       Accept:"application/json",
  //       "Content-Type": "application/json",
  //     }
  //   }
  //   return axios.post(
  //     _URL + "/getUpdatedAuthorities/" + userSessionData.userId,
  //     config

  //   )

  // }

  getUpdatedAuthorities(payload) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    payload = {};
    return axios.post(
      _URL + '/getUpdatedAuthorities/' + userSessionData.userId,
      payload,
      config
    );
  }

  deleteModuleSettingUser(id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(_URL + '/deleteModuleSettingUser/' + id, config);
  }

  updateModuleAuthority(payload) {
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
    return axios.post(_URL + '/createModuleAuthority', payload, config);
  }

  getBillDetailsOfPaymentGrid(id, payload) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    // payload.append("updated_by", userSessionData.userId);
    // payload.append("updated_at", getDateTime());
    return axios.post(
      _URL + '/getBillDetailsOfPaymentGrid/' + id,
      payload,
      config
    );
  }

  getBillCheckData() {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(_URL + '/getBillCheck/' + userSessionData.userId, config);
  }

  getModuleAuthorityUserSetting(id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,

        Accept: 'application/json',

        'Content-Type': 'application/json'
      }
    };

    return axios.get(
      _URL + '/getModuleAuthorityUserSetting/' + id,

      config
    );
  }

  getSubmodule(id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,

        Accept: 'application/json',

        'Content-Type': 'application/json'
      }
    };

    return axios.get(_URL + '/getSubMenuName/' + id, config);
  }

  getPaymentDetails(id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(_URL + '/getPaymentDetails/' + id, config);
  }

  getBillCheckingById(id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(
      _URL + '/getBillCheckById/' + id + '/' + localStorage.getItem('id'),
      config
    );
  }

  createData(payload, attachment) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    };
    payload.append('created_by', userSessionData.userId);
    payload.append('created_at', getDateTime());
    return axios.post(_URL + '/createBillCheck', payload, config);
  }

  filterBillCheckingData(payload) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    payload.append('tenant_id', userSessionData.tenantId);
    return axios.post(_URL + '/filterBillCheckingData', payload, config);
  }

  updateBillChecking(id, payload) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        // "Content-Type": "application/json",
        'Content-Type': 'multipart/form-data'
      }
    };
    payload.append('updated_by', userSessionData.userId);
    payload.append('updated_at', getDateTime());
    return axios.post(_URL + '/updateBillCheck/' + id, payload, config);
  }

  cancelBill(id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.post(_URL + '/isCancelBill/' + id, {}, config);
  }

  getSectionDropdown() {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(_URL + '/getSectionDropdown', config);
  }

  getSectionMappingDropdown(id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(_URL + '/getSectionMappingDropdown/' + id, config);
  }
  getBillCheckHistory(id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(_URL + '/getBillCheckHistoryById/' + id, config);
  }

  getAssignPersonDetail(id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(_URL + '/getAssignPersonDetail/' + id, config);
  }
  _getBillTypeDataDropdown() {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(_getBillTypeDataDropdown, config);
  }

  // getVendorsDropdown(){
  //     return axios.get(_getVendors);
  // }

  getVendorsDropdown() {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(_getVendors, config);
  }

  getBillCreateAuthority() {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(
      _URL + '/getCheckAuthority/' + userSessionData.userId,
      config
    );
  }
}
