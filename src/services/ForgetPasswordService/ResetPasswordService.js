import axios from "axios";
import { rpURL, _ErrorMsg } from "../../settings/constants";

export function postData(payload) {
  const token = localStorage.getItem("jwt_token");
      
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  return axios.post(rpURL, payload,config);
}
