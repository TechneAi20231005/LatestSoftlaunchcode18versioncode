import axios from "axios";
import { masterURL, ticketUrl } from "../../settings/constants";
import { getDateTime } from "../../components/Utilities/Functions";
const _URL = ticketUrl.basket;
const _URL2 = masterURL.template;

export default class BasketService {
  getBakset() {
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

  postBasket(payload) {
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
    return axios.post(_URL + "/createBasket", payload, config);
  }

  getBasketById(id) {
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

  updateBasket(id, payload) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.post(_URL + "/updateBasket/" + id, payload, config);
  }

  updatetempalateBasket(id, payload) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.post(_URL2 + "/updateBasket/" + id, payload, config);
  }

  pushForward(payload) {
    const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(_URL + "/swapBasket", payload, config);
  }

  getBasketTaskData(id, sprint_id) {
    const token = localStorage.getItem("jwt_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const userId = localStorage.getItem("id");
    return axios.get(
      _URL + "/" + id + "/" + userId + "?" + "sprint_id=" + sprint_id,
      config
    );
  }
}
