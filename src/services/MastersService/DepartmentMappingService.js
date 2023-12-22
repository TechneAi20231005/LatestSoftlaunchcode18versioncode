import axios from "axios";
import {userSessionData} from '../../settings/constants';
import {masterURL} from '../../settings/constants';

const _URL=masterURL.departmentMapping;

const _getAllDepartmentMapping=_URL+"/getAllDepartmentMapping"   
const _createDeparmentMapping=_URL+"/createDepartmentMapping";    
const _updateDepartmentMapping=_URL+"/updateDepartmentMapping/";
const _getDepartmentMappingById=_URL+"/getDepartmentMappingById/";    
const _getDepartmentMappingByEmployeeId=_URL+"/getDepartmentMappingByEmployeeId/";    

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
   

export default class DepartmentMappingService{

    getAllDepartmentMapping(){
        const token = localStorage.getItem("jwt_token");
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
    
        return axios.get(_getAllDepartmentMapping,config);
    }
    
    postDepartmentMapping(payload){
        payload.append('tenant_id',userSessionData.tenantId);
        payload.append('created_by',userSessionData.userId);
        payload.append('created_at',getDateTime());  
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
    
        return axios.post(_createDeparmentMapping,payload,config)
    }
    
    getDepartmentMappingByEmployeeId(employeeId){
        const token = localStorage.getItem("jwt_token");
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
    
        return axios.get(_getDepartmentMappingByEmployeeId+employeeId,config);
    }

    getDepartmentMappingById(id){
        const token = localStorage.getItem("jwt_token");
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.get(_getDepartmentMappingById+id,config);
    }
    
    updateDepartmentMapping(id,payload){
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

        return axios.post(_updateDepartmentMapping+id,payload,config)
    }
}

