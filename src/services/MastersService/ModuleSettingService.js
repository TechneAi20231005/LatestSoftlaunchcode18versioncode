import axios from "axios";
import {masterURL} from '../../settings/constants';
import {getDateTime} from '../../components/Utilities/Functions'

const _URL=masterURL.moduleSetting;

export default class ModuleSettingService{

     getModuleSetting(){
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
    
     postModuleSetting(payload){
         payload.append('tenant_id',localStorage.getItem('tenant_id'));
        payload.append('created_by',localStorage.getItem('id'));
        payload.append('created_at',getDateTime());  
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
    
     getModuleSettingById(id){
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
    
    updateModuleSetting(id,payload){
        payload.append('updated_by',localStorage.getItem('id'));
        payload.append('updated_at',getDateTime());
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

    getSetting(payload){
         payload.append('tenant_id',localStorage.getItem('tenant_id'));
        const token = localStorage.getItem("jwt_token");
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.post(_URL+"/getSetting",payload,config);
    }

}

