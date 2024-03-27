import { settingMasterUrl } from "../../settings/constants";
import axios from "axios";

const URL = settingMasterUrl.getGeneralSetting;
const createSetting = URL + "/createGeneralSetting";
const getGeneralSetting = URL + "/getGeneralSetting";

const getAuthorityCheck = URL + "/getCheckSettingAuthority";

export default class GeneralSettingService {
  createGeneralSetting(payload) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(createSetting, payload, config);
  }
  updateGeneralSetting(id, payload) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(createSetting + "/" + id, payload, config);
  }

  getGeneralSetting() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(getGeneralSetting, config);
  }

  getAuthorityCheck(userId, projectId) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(`${getAuthorityCheck}/${userId}/${projectId}`, config);
  }
}

//http://3.108.206.34/3_SoftLaunch/TSNewBackend/public/api/consolidatedView/createGenaralSetting
