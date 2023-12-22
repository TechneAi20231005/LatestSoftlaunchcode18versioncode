import axios from "axios";
import { otpURL, _ErrorMsg } from "../../settings/constants";

export function postDataa(payload) {
  const token = localStorage.getItem("jwt_token");
      
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  return axios.post(otpURL, payload,config);
}
