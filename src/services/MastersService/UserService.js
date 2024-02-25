import axios from "axios";
import { masterURL, userSessionData } from "../../settings/constants";
import { getDateTime } from "../../components/Utilities/Functions";
const _URL = masterURL.user;

export default class UserService {
  // getUser(){
  //     return axios.get(_URL);
  // }
  getUser() {
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

  getExportTicket() {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const url = `${_URL}?type=EXPORT`
      
    return axios.get(url, config);

  }
  getUserForMyTickets(queryParams) {
    const token = localStorage.getItem("jwt_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const url = `${_URL}?input_required=${queryParams}`;
      
    return axios.get(url, config);

    
  }

  // getUsers(id){
  //     return axios.get(_URL+"/except/"+id);
  // }

  getUsers(id) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_URL + "/except/" + id, config);
  }

//   getUserWithMultipleDepartment() {
//     return axios.get(_URL + "/getUserWithMultipleDepartment");
//   }


getUserWithMultipleDepartment(id) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_URL + "/getUserWithMultipleDepartment", config);
  }


  postUser(payload) {
    payload.append("tenant_id", userSessionData.tenantId);
    payload.append("created_by", localStorage.getItem("id"));
    payload.append("created_at", getDateTime());
    // return axios.post(_URL, payload);

    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.post(_URL,payload, config);
  }

//   getUserById(id) {
//     return axios.get(_URL + "/" + id);
//   }


getUserById(id) {
    const token = localStorage.getItem("jwt_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_URL + "/" + id,config);
  }

  updateUser(id, payload) {
    payload.append("tenant_id", userSessionData.tenantId);
    payload.append("updated_by", localStorage.getItem("id"));
    payload.append("updated_at", getDateTime());
    // return axios.post(_URL + "/" + id, payload);
    
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.post(_URL + "/" + id,payload, config);
  }

  

  updateAccountDetails(id, payload) {
    payload.append("updated_by", localStorage.getItem("id"));
    payload.append("updated_at", getDateTime());
    // return axios.post(_URL + "/updateAccountDetails/" + id, payload);
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        // "Content-Type": "application/json",
        'Content-Type': 'multipart/form-data'
      },
    };

    return axios.post(_URL + "/updateAccountDetails/" + id,payload, config);
  }

  updatePasswordDetails(id, payload) {
    payload.append("updated_by", localStorage.getItem("id"));
    payload.append("updated_at", getDateTime());
    // return axios.post(_URL + "/updatePasswordDetails/" + id, payload);
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.post(_URL + "/updatePasswordDetails/" + id,payload, config);
  }
}
