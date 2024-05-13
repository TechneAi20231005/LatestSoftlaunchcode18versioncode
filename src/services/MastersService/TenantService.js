import axios from "axios";
import { _apiUrl, masterURL } from "../../settings/constants";
import { getDateTime } from "../../components/Utilities/Functions";
const _URL = masterURL.tenant;
const _tenantUrl = _apiUrl + "tenantLogin";

export default class TenantService {
  getTenant() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_URL, config);
  }

  postTenant(payload) {
    payload.append("created_by", localStorage.getItem("id"));
    payload.append("created_at", getDateTime());
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(_URL, payload, config);
  }

  getTenantById(id) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_URL + "/" + id, config);
  }

  updateTenant(id, payload) {
    payload.append("updated_by", localStorage.getItem("id"));
    payload.append("updated_at", getDateTime());
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(_URL + "/" + id, payload, config);
  }
  switchTenant(payload) {
    const token = localStorage.getItem("jwt_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(_tenantUrl, payload, config);
  }
}
