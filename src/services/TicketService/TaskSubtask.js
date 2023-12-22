import axios from "axios";
import {ticketUrl} from '../../settings/constants';
import { getDateTime } from "../../components/Utilities/Functions";

const _URL=ticketUrl.subtask;

export function getSubtask(taskId){
    const token = localStorage.getItem("jwt_token");
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_URL+"/"+taskId,config);
}

export function postSubtask(payload){
    const token = localStorage.getItem("jwt_token");
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    payload={...payload,'tenant_id':localStorage.getItem('tenant_id'),'created_by':localStorage.getItem('id'),'created_at':getDateTime()}
    return axios.post(_URL,payload,config);
}

export function completeSubtask(subtaskId,payload){
    const token = localStorage.getItem("jwt_token");
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(_URL+"/completeSubtask/"+subtaskId,payload,config);
}

export function deleteSubtask(subtaskId,payload){
    const token = localStorage.getItem("jwt_token");
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(_URL+"/deleteSubtask/"+subtaskId,payload,config);
}
