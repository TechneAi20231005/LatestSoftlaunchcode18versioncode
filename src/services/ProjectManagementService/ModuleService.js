import axios from "axios";
import {userSessionData} from '../../settings/constants';
import { projectManagementUrl } from "../../settings/constants";

const _URL=projectManagementUrl.moduleUrl;

const _getAllModule=_URL+"/getAllModule"    
const _postModule=_URL+"/createModule";    
const _getModuleById=_URL+"/getModuleById/";    
const _updateModule=_URL+"/updateModule/";

export default class ModuleService{
    getModule(){
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.get(_getAllModule,config);
    }
    
     postModule(payload){
        payload.append('tenant_id',userSessionData.tenantId);
        payload.append('created_by',userSessionData.userId);
        payload.append('created_at',userSessionData.time);  
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.post(_postModule,payload,config)
    }
    
    getModuleById(id){
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.get(_getModuleById+id,config);
    }
    
     updateModule(id,payload){
         payload.append('updated_by',userSessionData.tenantId);
        payload.append('updated_at',userSessionData.time);
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.post(_updateModule+id,payload,config)
    }
}

