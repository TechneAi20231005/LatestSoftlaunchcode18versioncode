import axios from "axios";
import { userSessionData } from "../../settings/constants";
import { ticketUrl, _apiUrl } from "../../settings/constants";

const _URL = ticketUrl.ticket;
const _getAllTicket = _URL + "/getAllTicket/" + userSessionData.userId;
const _getAllTicketTest = _URL + "/getAllTicketTest";
const _getAllTicketNew = _URL + "/getAllTicketNew";

const _createTicket = _URL + "/createTicket";
const _updateTicket = _URL + "/updateTicket/";
const _getTicketById = _URL + "/getTicketById/";
const _createComment = _URL + "/comment/createComment";
const _getAllComment = _URL + "/comment/getAllComment/";
const _createGanttChart = _apiUrl + "hoursWiseTaskRecord/";

const _passTicket = _URL + "/passTicket";
const _passBulkTicket = _URL + "/bulkpassTicket";

export default class MyTicketService {
  getUserTickets() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_getAllTicket, config);
  }

  getUserTicketsTest(payload) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(_getAllTicketTest, payload, config);
  }

  getExpectedSolveDate(cuMappingId) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_URL + "/selectDate/" + cuMappingId, config);
  }

  postTicket(payload) {
    //  payload.append("tenant_id", userSessionData.tenantId);
    payload.append("created_by", userSessionData.userId);
    // payload.append("created_at", userSessionData.time);
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };
    return axios.post(_createTicket, payload, config);
  }

  getAllTicketNew(payload) {
    payload.append("tenant_id", userSessionData.tenantId);
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.post(_getAllTicketNew, payload, config);
  }

  getTicketById(id) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    console.log("_getTicketById", _getTicketById);
    return axios.get(_getTicketById + id, config);
  }

  updateTicket(id, payload) {
    payload.append("updated_by", userSessionData.userId);
    payload.append("tenant_id", userSessionData.tenantId);
    payload.append("updated_at", userSessionData.time);
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        // Accept: "application/json",
        // "Content-Type": "application/json",
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };
    return axios.post(_updateTicket + id, payload, config);
  }

  postComment(payload) {
    payload = {
      ...payload,
      created_by: userSessionData.userId,
      created_at: userSessionData.time,
    };

    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(_createComment, payload, config);
  }

  getComments(id) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_getAllComment + id, config);
  }

  getGanttChart(id) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_createGanttChart + id, config);
  }
  passTicket(payload) {
    payload.append("user_id", userSessionData.userId);
    payload.append("updated_at", userSessionData.time);
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(_passTicket, payload, config);
  }

  sendTicketConfirmationOtp(ticket_id) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_URL + "/sendTicketConfirmationOtp/" + ticket_id, config);
  }

  verifyTicketConfirmationOtp(id, payload) {
    payload.append("updated_by", userSessionData.userId);
    payload.append("updated_at", userSessionData.time);
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(
      _URL + "/verifyTicketConfirmationOtp/" + id,
      payload,
      config
    );
  }

  getBulkFormat(payload) {
    // payload.append("created_by", userSessionData.userId);
    // payload.append("created_at", userSessionData.time);
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(_URL + "/getBulkFormat", payload, config);
  }

  getHistory(id) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_URL + "/getTicketHistory/" + id, config);
  }
}
