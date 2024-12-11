import axios from 'axios';
import { loginURL } from '../settings/constants';
console.log('loginURL', loginURL);
export function getData(config, callback, errorcallback) {}

export function postData(config) {
  return axios.post(
    loginURL,

    config
  );
}

// export function postData(config){
//      return axios.post(loginURL,config);
// }
