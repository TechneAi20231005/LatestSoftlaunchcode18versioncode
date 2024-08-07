import axios from "axios";
import {userSessionData} from '../../../settings/constants';
import {billCheckingMasterUrl} from '../../../settings/constants';

const _URL = billCheckingMasterUrl.billChecking






export function getDateTime(){
    var now = new Date();
    let year=now.getFullYear();
    let month=now.getMonth()+1;
        month= month  >= 10 ?  month : `0${month}`
    let day=now.getDate() >= 10 ? now.getDate() : `0${now.getDate()}`
    let hour=now.getHours() >= 10 ? now.getHours() : `0${now.getHours()}`
    let min=now.getMinutes() >= 10 ? now.getMinutes() : `0${now.getMinutes()}`
    let sec=now.getSeconds() >= 10 ? now.getSeconds() : `0${now.getSeconds()}`
     var datetime = year+'-'+month+'-'+day+' '+hour+':'+min+':'+sec;
     return datetime;
  }

export default class BillPaymentServices{



  
    getBillPayments(payload){
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.post(_URL+"/getBillPayment/"+userSessionData.userId, payload,config)
    }


    downloadTxtFile(payload){
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.post(_URL+"/postDownloadFile", payload,config)
    }


    autoUpdatePayment(payload){
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            'Content-Type': 'multipart/form-data'
          },
        };
        return axios.post(_URL+"/postPaymentUpdate", payload,config)
    }
}
