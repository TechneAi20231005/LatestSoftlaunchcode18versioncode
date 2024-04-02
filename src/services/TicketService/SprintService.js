import axios from "axios";
import { masterURL, ticketUrl } from "../../settings/constants";

const _URL = masterURL.sprintMaster;

export default class SprintService {
  getAllSprint() {
    const token = localStorage.getItem("jwt_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(`${_URL}/getSprint`, config);
  }

  getSprintById(id) {
    const token = localStorage.getItem("jwt_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(`${_URL}/getSprint/${id}`, config);
  }

  getSprintByTicketId(ticketid) {
    const token = localStorage.getItem("jwt_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(`${_URL}/getSprintByTicketId/${ticketid}`, config);
  }

  postSprintForTicket(payload) {
    const token = localStorage.getItem("jwt_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(`${_URL}/createSprint`, payload, config);
  }

  getSprintReportById(ticket_id, sprint_id) {
    const token = localStorage.getItem("jwt_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(
      `${_URL}/getSprintReport/${ticket_id}/${sprint_id}`,
      config
    );
  }

  // http://3.108.206.34/3_SoftLaunch/TSNewBackend/public/api/sprintMaster/createSprint/5

  updateSprintDetail(payload, sprint_id) {
    const token = localStorage.getItem("jwt_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(`${_URL}/createSprint/${sprint_id}`, payload, config);
  }
}
