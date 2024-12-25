import axios from 'axios';
import { loginURL, _apiUrl } from '../settings/constants';
console.log('loginURL', loginURL);
const login = _apiUrl + 'login';
export function getData(config, callback, errorcallback) {}

export function postData(config) {
  return axios.post(
    // loginURL,
    login,

    config
  );
}

// export function postData(config){
//      return axios.post(loginURL,config);
// }
