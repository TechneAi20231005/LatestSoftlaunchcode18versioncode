import axios from "axios";
import { masterURL } from "../../settings/constants";

const _URL = masterURL.sprintMaster;

export default class SprintService {
  getAllSprint(sprint_id) {
    const token = localStorage.getItem("jwt_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(`${_URL}/getSprint/${sprint_id}`, config);
  }

  getSprintById(ticket_id, sprint_id) {
    const token = localStorage.getItem("jwt_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(`${_URL}/getSprint/${ticket_id}/${sprint_id}`, config);
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
    return axios.get(`${_URL}/getSprint/${ticketid}`, config);
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

  getSprintCalendar(ticket_id) {
    const token = localStorage.getItem("jwt_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    // http://3.108.206.34/2_Testing/TSNewBackend/public/api/sprintMaster/getGraphCalenderData/

    return axios.get(`${_URL}/getGraphCalenderData/${ticket_id}`, config);
  }

  getSprintCalendarDataForWeek(ticket_id, from_date, to_date) {
    const token = localStorage.getItem("jwt_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(
      `${_URL}/getCalenderData/${ticket_id}?from_date=${from_date}&to_date=${to_date}`,
      config
    );
  }
  //http://3.108.206.34/3_SoftLaunch/TSNewBackend/public/api/sprintMaster/getCalenderData/9425?from_date=2023-06-03&to_date=2023-06-04
}
