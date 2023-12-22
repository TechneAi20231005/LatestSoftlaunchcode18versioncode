import axios from "axios";
import {ticketUrl} from '../../settings/constants';
import { getDateTime } from "../../components/Utilities/Functions";

const _URL=ticketUrl.ticket;

export function getData(){
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


export function getDataOfUser(id){
    const token = localStorage.getItem("jwt_token");
      
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_URL+"/dataOfUser/"+id,config);
}

export function postData(payload){
    // payload={...payload,'tenant_id':localStorage.getItem('tenant_id'),'created_by':localStorage.getItem('id'),'created_at':getDateTime()}
    const token = localStorage.getItem("jwt_token");
      
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    payload.append('tenant_id',localStorage.getItem('tenant_id')) 
    payload.append('created_by',localStorage.getItem('id'))
    payload.append('created_at',getDateTime())
    return axios.post(_URL,payload,config)
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

export function putData(id,payload){
    // payload={...payload,'tenant_id':localStorage.getItem('tenant_id'),  'updated_by':localStorage.getItem('id'),'updated_at':getDateTime()}
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
    return axios.post(_URL+"/"+id,payload,config);
}

export function postDataComment(payload){    
    const token = localStorage.getItem("jwt_token");
      
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    payload={...payload,'tenant_id':localStorage.getItem('tenant_id'),'created_by':localStorage.getItem('id'),'created_at':getDateTime()}
    return axios.post(_URL+"/comment/comment", payload,config);
}

export function getCommentsUsingParam(id){
    const token = localStorage.getItem("jwt_token");
      
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_URL+"/comment/"+id,config)
}

export function sendTicketConfirmationOtp(ticket_id){
    const token = localStorage.getItem("jwt_token");
      
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios.get(_URL+"/sendTicketConfirmationOtp/"+ticket_id,config)
}

export function verifyTicketConfirmationOtp(payload,ticket_id){
    const token = localStorage.getItem("jwt_token");
      
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
        payload.append('updated_by',localStorage.getItem('id'))
        payload.append('updated_at',getDateTime())
                
    return axios.post(_URL+"/verifyTicketConfirmationOtp/"+ticket_id,config)
}

