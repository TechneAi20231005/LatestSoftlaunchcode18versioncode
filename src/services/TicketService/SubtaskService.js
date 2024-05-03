import axios from "axios";
import { ticketUrl } from "../../settings/constants";
import { getDateTime } from "../../components/Utilities/Functions";
const _URL = ticketUrl.subtask;

export default class SubtaskService {
  getSubtask(taskId) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_URL + "/" + taskId, config);
  }

  postSubtask(payload) {
    payload.append("tenant_id", localStorage.getItem("tenant_id"));
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

  completeSubtask(subtaskId, payload) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(_URL + "/completeSubtask/" + subtaskId, payload, config);
  }

  deleteSubtask(subtaskId, payload) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(
      _URL + "/deleteSubtask/" + subtaskId,
      payload,
      config
    );
  }
}
