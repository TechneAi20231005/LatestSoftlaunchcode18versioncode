import axios from "axios";
import { attachmentUrl } from "../../settings/constants";
const _URL = `${_attachmentUrl}/public/api/`;
export function getAttachment(id, type) {
  if (id) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_URL + "/" + id + "/" + type, config);
  }
}

export function deleteAttachment(id) {
  const token = localStorage.getItem("jwt_token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  return axios.delete(_URL + "/" + id, config);
}
