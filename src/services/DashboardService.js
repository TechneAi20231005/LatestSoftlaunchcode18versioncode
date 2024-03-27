import axios from "axios";
import { dashboardUrl } from '../settings/constants';

const _URL = dashboardUrl;

// export function getData(id){
//     return axios.get(_URL+"/"+id);
// }



// export function getData(id){
//     return axios.get(_URL+"/"+id);
// }

export function getData() {

  const token = localStorage.getItem("jwt_token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  return axios.get(`http://3.108.206.34/3_SoftLaunch/TSNewBackend/public/api/dashboard`, config);
}


