import axios from "axios";
import {getDateTime} from '../components/Utilities/Functions'
import { projectUrl } from "../settings/constants";

const _URL=projectUrl;
export function getProject(){
    const token = localStorage.getItem("jwt_token");
      
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_URL,config);
}

export function postProject(payload){
    payload.append('tenant_id',localStorage.getItem('tenant_id')) 
    payload.append('created_by',localStorage.getItem('id'))
    payload.append('created_at',getDateTime())
    const token = localStorage.getItem("jwt_token");
      
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.post(_URL,payload,config) 
}

export function getProjectById(id){
    const token = localStorage.getItem("jwt_token");
      
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_URL+"/"+id,config);
}

export function updateProject(id,payload){
    payload.append('tenant_id',localStorage.getItem('tenant_id')) 
    payload.append('updated_by',localStorage.getItem('id'))
    payload.append('updated_at',getDateTime())
    const token = localStorage.getItem("jwt_token");
      
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
   
    return axios.post(_URL+"/"+id,payload,config)
}

export function getClientData(){
    const token = localStorage.getItem("jwt_token");
      
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_URL+"/client",config);
}