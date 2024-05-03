import axios from "axios";
import {connectorUrl} from '../../settings/constants';
import {getDateTime} from '../../components/Utilities/Functions'

const _URL=connectorUrl.testcaseUrl;

export default class TestCaseService{
    postTestcase(module_id,submodule_id,payload){ 
        const token = localStorage.getItem("jwt_token");
      
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        payload.append('module_id',module_id) 
        payload.append('submodule_id',submodule_id) 
        payload.append('tenant_id',localStorage.getItem('tenant_id')) 
        payload.append('created_by',localStorage.getItem('id'))
        payload.append('created_at',getDateTime())

        return axios.post(_URL,payload,config)
    }

    getTestcase(module_id, submodule_id){  
        const token = localStorage.getItem("jwt_token");
      
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        if(submodule_id != ""){
            return axios.get(_URL+"/"+module_id+"/"+submodule_id,config);
        } else{
            return axios.get(_URL+"/"+module_id,config);
        }        
    }

    deleteTestcase(module_id, submodule_id){  
        const token = localStorage.getItem("jwt_token");
      
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        if(submodule_id != ""){
            return axios.delete(_URL+"/"+module_id+"/"+submodule_id,config);
        } else{
            return axios.delete(_URL+"/"+module_id,config);
        }        
    }
    
}