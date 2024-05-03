import axios from "axios";
const { errorLogUrl } = require("../settings/constants");
const { getDateTime } = require("../components/Utilities/Functions");
const internalIpV4 = require("internal-ip").internalIpV4;
// const publicIp = require('public-ip');
const platform = require("platform");

export default class ErrorLogService {
  sendErrorLog(module_name, submodule_name, operation, message) {
    let payload = {
      module_name: module_name,
      submodule_name: submodule_name,
      operation: operation,
      message: message,
    };

    this.catchError(payload);
  }

  async catchError(payload) {
    const _URL = errorLogUrl.catchError;
    const _ipAddress = await internalIpV4();

    payload = {
      ...payload,
      tenant_id: localStorage.getItem("tenant_id"),
      user_id: localStorage.getItem("id"),
      ip_address: _ipAddress,
      platform_type: "BROWSER",
      platform_name: platform.name,
      platform_version: platform.version,
      platform_os: platform.os.family,
      created_by: localStorage.getItem("id"),
      created_at: getDateTime(),
    };
    return axios.post(_URL, payload).then((r) => {});
  }
}
