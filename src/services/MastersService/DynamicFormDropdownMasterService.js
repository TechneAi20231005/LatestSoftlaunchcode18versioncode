import axios from 'axios';
import { masterURL } from '../../settings/constants';
import { getDateTime } from '../../components/Utilities/Functions';
const _URL = masterURL.dynamicFormDropdownMaster;

export default class DynamicFormDropdownMasterService {
  getAllDynamicFormDropdown() {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(_URL + '/getData', config);
  }

  // getAllDynamicFormDropdown(){

  //   const token = localStorage.getItem("jwt_token");

  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //   };

  //     return axios.get(_URL+"/getAllDynamicFormDropdown/"+localStorage.getItem('tenant_id')+config);
  // }

  getAllDynamicFormDropdownData(dropdown_id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(
      _URL + '/getAllDynamicFormDropdownData/' + dropdown_id,
      config
    );
  }

  getAllDropdown() {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(_URL + '/getAllDropdown', config);
  }

  getDropdownByName(payload) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.post(_URL + '/getDropdownByName', payload, config);
  }
  getDropdownById(dropdown_id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(_URL + '/dropdownById/getData/' + dropdown_id, config);
  }

  updateDropdown(id, payload) {
    payload.append('tenant_id', localStorage.getItem('tenant_id'));
    payload.append('updated_by', localStorage.getItem('id'));
    payload.append('updated_at', getDateTime());
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.post(_URL + '/postData/' + id, payload, config);
  }

  createDropdown(payload) {
    payload.append('tenant_id', localStorage.getItem('tenant_id'));
    payload.append('created_by', localStorage.getItem('id'));
    payload.append('created_at', getDateTime());
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.post(_URL + '/postData', payload, config);
  }

  // postUser(payload){
  //     payload.append('tenant_id',localStorage.getItem('tenant_id'));
  //     payload.append('created_by',localStorage.getItem('id'));
  //     payload.append('created_at',getDateTime());
  //     return axios.post(_URL,payload)
  // }

  // getUserById(id){
  //     return axios.get(_URL+"/"+id)
  // }

  // updateUser(id,payload){
  //     payload.append('tenant_id',localStorage.getItem('tenant_id'))
  //     payload.append('updated_by',localStorage.getItem('id'));
  //     payload.append('updated_at',getDateTime());
  //     return axios.post(_URL+"/"+id,payload)
  // }

  // updateAccountDetails(id,payload){
  //     payload.append('updated_by',localStorage.getItem('id'));
  //     payload.append('updated_at',getDateTime());
  //     return axios.post(_URL+"/updateAccountDetails/"+id,payload)
  // }

  // updatePasswordDetails(id,payload){
  //     payload.append('updated_by',localStorage.getItem('id'));
  //     payload.append('updated_at',getDateTime());
  //     return axios.post(_URL+"/updatePasswordDetails/"+id,payload)
  // }
}

// import axios from "axios";
// import {masterURL} from '../../settings/constants';
// import {getDateTime} from '../../components/Utilities/Functions'
// const _URL=masterURL.dynamicFormDropdownMaster;

// export default class DynamicFormDropdownMasterService{

//     getAllDynamicFormDropdown(){
//         return axios.get(_URL+"/getAllDynamicFormDropdown/"+localStorage.getItem('tenant_id'));
//     }

//     getAllDynamicFormDropdownData(dropdown_id){
//         return axios.get(_URL+"/getAllDynamicFormDropdownData/"+localStorage.getItem('tenant_id')+"/"+dropdown_id);
//     }

//     getAllDropdown(){
//         return axios.get(_URL+"/getAllDropdown/"+localStorage.getItem('tenant_id'));
//     }

//     getDropdownByName(dropdown_name){
//         return axios.get(_URL+"/getDropdownByName/"+localStorage.getItem('tenant_id')+"/"+dropdown_name);
//     }

// createDropdown(payload){
//     payload.append('tenant_id',localStorage.getItem('tenant_id'));
//     payload.append('created_by',localStorage.getItem('id'));
//     payload.append('created_at',getDateTime());
//     return axios.post(_URL+"/createDropdown",payload);
// }

//     getDropdownById(dropdown_id){
//         return axios.get(_URL+"/getDropdownById/"+dropdown_id);
//     }

//     updateDropdown(payload){
//         payload.append('tenant_id',localStorage.getItem('tenant_id'));
//         payload.append('updated_at',localStorage.getItem('id'));
//         payload.append('updated_by',getDateTime());
//         return axios.post(_URL+"/updateDropdown",payload);
//     }

// postUser(payload){
//     payload.append('tenant_id',localStorage.getItem('tenant_id'));
//     payload.append('created_by',localStorage.getItem('id'));
//     payload.append('created_at',getDateTime());
//     return axios.post(_URL,payload)
// }

// getUserById(id){
//     return axios.get(_URL+"/"+id)
// }

// updateUser(id,payload){
//     payload.append('tenant_id',localStorage.getItem('tenant_id'))
//     payload.append('updated_by',localStorage.getItem('id'));
//     payload.append('updated_at',getDateTime());
//     return axios.post(_URL+"/"+id,payload)
// }

// updateAccountDetails(id,payload){
//     payload.append('updated_by',localStorage.getItem('id'));
//     payload.append('updated_at',getDateTime());
//     return axios.post(_URL+"/updateAccountDetails/"+id,payload)
// }

// updatePasswordDetails(id,payload){
//     payload.append('updated_by',localStorage.getItem('id'));
//     payload.append('updated_at',getDateTime());
//     return axios.post(_URL+"/updatePasswordDetails/"+id,payload)
// }

// }
