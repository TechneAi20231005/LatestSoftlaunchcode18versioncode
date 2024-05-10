import axios from 'axios';
import { masterURL } from '../../settings/constants';

const _URL = masterURL.sprintMaster;

export default class SprintService {
  getAllSprint(sprint_id) {
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return axios.get(`${_URL}/getSprint/${sprint_id}`, config);
  }

  getSprintById(ticket_id, sprint_id) {
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return axios.get(`${_URL}/getSprint/${ticket_id}/${sprint_id}`, config);
  }

  getSprintByTicketId(ticketid) {
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return axios.get(`${_URL}/getSprint/${ticketid}`, config);
  }

  postSprintForTicket(payload) {
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return axios.post(`${_URL}/createSprint`, payload, config);
  }

  getSprintReportById(ticket_id, sprint_id) {
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return axios.get(`${_URL}/getSprintReport/${ticket_id}/${sprint_id}`, config);
  }
  updateSprintDetail(payload, sprint_id) {
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return axios.post(`${_URL}/createSprint/${sprint_id}`, payload, config);
  }

  getSprintCalendar(ticket_id) {
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    // http://3.108.206.34/2_Testing/TSNewBackend/public/api/sprintMaster/getGraphCalenderData/

    return axios.get(`${_URL}/getGraphCalenderData/${ticket_id}`, config);
  }

  getSprintCalendarDataForWeek(ticket_id, from_date, to_date) {
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    return axios.get(
      `${_URL}/getCalenderData/${ticket_id}?from_date=${from_date}&to_date=${to_date}`,
      config,
    );
  }

  getGraphDataForSprint(ticket_id, from_date, to_date) {
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    return axios.get(
      `${_URL}/getGraphData/${ticket_id}?from_date=${from_date}&to_date=${to_date}`,
      config,
    );
  }
  // ?from_date=${from_date}&to_date=${to_date}

  //http://3.108.206.34/3_SoftLaunch/TSNewBackend/public/api/sprintMaster/getGraphData/17816
  //http://3.108.206.34/3_SoftLaunch/TSNewBackend/public/api/sprintMaster/getCalenderData/9425?from_date=2023-06-03&to_date=2023-06-04
}

////axios
// import axios from 'axios';

// const _URL = 'http://your-api-url'; // Assuming _URL is defined globally or imported

// const axiosInstance = axios.create({
//   baseURL: _URL,
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("jwt_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     config.headers.Accept = "application/json";
//     config.headers["Content-Type"] = "application/json";
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     const { response } = error;
//     if (response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.error("Response error status:", response.status);
//       throw new Error(response.data.message || "Server Error");
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.error("Request error:", error.request);
//       throw new Error("Network Error");
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.error("Error message:", error.message);
//       throw new Error("Request Error");
//     }
//   }
// );

// export default class SprintService {
//   constructor() {
//     this.api = axiosInstance;
//   }

//   // Your existing methods here...

//   async getSprintCalendarDataForWeek(ticket_id, from_date, to_date) {
//     try {
//       const response = await this.api.get(
//         `/getCalenderData/${ticket_id}?from_date=${from_date}&to_date=${to_date}`
//       );
//       return response.data;
//     } catch (error) {
//       console.error("SprintService error:", error);
//       throw error; // Re-throw the error for the calling code to handle
//     }
//   }

//   // Other methods...
// }
