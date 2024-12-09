import axios from 'axios';
import { loginURL } from '../settings/constants';

export function getData(config, callback, errorcallback) {}

export function postData(config) {
  return axios.post(
    //     loginURL,
    'http://103.97.105.81:89/TicketingDev/public/api/login',
    config
  );
}

// export function postData(config){
//      return axios.post(loginURL,config);
// }
