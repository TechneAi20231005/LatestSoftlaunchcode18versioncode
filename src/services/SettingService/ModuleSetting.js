
import axios from "axios";
import {userSessionData} from '../../settings/constants';
import {settingMasterUrl} from '../../settings/constants';
import {getDateTime} from '../../components/Utilities/Functions'

const _URL=settingMasterUrl.moduleSetting;
const __URL = settingMasterUrl.getModuleSetting;

const _getAllModuleSetting=_URL+"/getAllModuleSetting"  
const _getModuleSetting=__URL+"/getModuleSetting";  
const _updateAllModuleSetting=_URL+"/updateAllModuleSetting";        
const _getSettingByName=_URL+"/getSettingByName";

export default class ModuleSetting {

    getSettingByName(module_name,submodule_name){  
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.get(_getSettingByName+"/"+module_name+"/"+submodule_name,config);
    }  

    getAllModuleSetting(){
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };

        return axios.get(_getAllModuleSetting,config)
    }

    updateAllModuleSetting(payload){
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
        return axios.post(_updateAllModuleSetting,payload,config)
    }
    
    getModuleSetting(payload){  
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.get(_getModuleSetting+"/"+payload,config);
    }      

}