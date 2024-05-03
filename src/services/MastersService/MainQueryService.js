import axios from "axios";
import {userSessionData} from '../../settings/constants';
import {masterURL} from '../../settings/constants';

const _URL=masterURL.queryType;

const _getAllMainQuery=_URL+"/getQueryTypeMapping"    
const _postMainQuery=_URL+"/addQueryTypeMapping";    
const _getMainQueryById=_URL+"/getMainQueryById/";    
const _updateMainQuery=_URL+"/updateMainQuery/";    
const _getQueryTypeForm=_URL+"/getQueryTypeForm"

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

export default class MainQueryService{

    getAllMainQuery(){
        const token = localStorage.getItem("jwt_token");
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };

        return axios.get(_getAllMainQuery,config);
    }
    
     postMainQuery(payload){
         payload.append('tenant_id',userSessionData.tenantId);
        payload.append('created_by',userSessionData.userId);
        payload.append('created_at',getDateTime());   
         const token = localStorage.getItem("jwt_token");
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };

        return axios.post(_postMainQuery,payload,config)
    }
    
    getMainQueryById(id){
        const token = localStorage.getItem("jwt_token");
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.get(_getMainQueryById+id,config);
    }
    
    updateMainQuery(id,payload){
        payload.append('updated_by',userSessionData.userId);
        payload.append('updated_at',getDateTime());
        const token = localStorage.getItem("jwt_token");
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.post(_updateMainQuery+id,payload,config)
    }

    // getQueryTypeForm(id){
    //     return axios.get(_getQueryTypeForm+"/"+id)
    // }
}
