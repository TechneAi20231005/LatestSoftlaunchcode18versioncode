import axios from "axios";
import {userSessionData} from '../../settings/constants';
import {masterURL} from '../../settings/constants';

const _URL=masterURL.role;

// const _allRole=_URL+"/getAllRole/"+userSessionData.tenantId;    
const _allRole=_URL+"/getAllRole";
const _postRole=_URL+"/createRole";    
const _getRoleById=_URL+"/getRoleById/";    
const _updateRole=_URL+"/updateRole/";    

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

export default class RoleService{

    //  getRole(){
    //     return axios.get(_allRole);
    // }

    getRole() {
        const token = localStorage.getItem("jwt_token");
      
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
      
        return axios.get(_allRole, config);
      }
      
    
    
     postRole(payload){

        const token = localStorage.getItem("jwt_token");
      
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        payload.append('tenant_id',userSessionData.tenantId);
        payload.append('created_by',userSessionData.userId);
        payload.append('created_at',getDateTime());  
        // return axios.post(_postRole,payload)

       
      
        return axios.post(_postRole,payload, config);
      }
    
    
    //  getRoleById(id){
    //     return axios.get(_getRoleById+id);
    // }
    getRoleById(id) {
        const token = localStorage.getItem("jwt_token");
      
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
      
        return axios.get(_getRoleById+id, config);
      }
      
    
     updateRole(id,payload){

        const token = localStorage.getItem("jwt_token");
      
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
      
        payload.append('updated_by',userSessionData.userId);
        payload.append('updated_at',getDateTime());
        // return axios.post(_updateRole+id,payload)
        
        return axios.post(_updateRole+id,payload, config);
      }
      
    }


