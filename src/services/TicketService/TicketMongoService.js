import axios from "axios";
import {ticketUrl,_ErrorMsg,dataFormat} from '../../settings/constants';

const _URL=ticketUrl.dynamicForm;

export function getData(){
    const token = localStorage.getItem("jwt_token");
      
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return axios.get(_URL,config)
}

export function postData(){
    const token = localStorage.getItem("jwt_token");
      
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(_URL,config)
}

export function getDataUsingParam(id){
    const token = localStorage.getItem("jwt_token");
      
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_URL+"/"+id,config)
}

export function putData(id){
    const token = localStorage.getItem("jwt_token");
      
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.put(_URL+"/"+id,config)
}