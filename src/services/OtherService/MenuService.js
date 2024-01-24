import axios from "axios";
import {menuUrl} from '../../settings/constants';

const _URL=menuUrl;

export function getMenu(){
    const token = localStorage.getItem("jwt_token");
    const role_id =localStorage.getItem("role_id");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_URL,config)
}
