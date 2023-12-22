// 


import axios from "axios";
import { consolidateViewUrl, projectManagementUrl} from "../../settings/constants";
import {userSessionData} from '../../settings/constants';

// const _URL =reportUrl.consolidatedView
// const _getConsolidatedView =_URL+"/ConsolidatedView/"+userSessionData.tenantId;    
const URL = projectManagementUrl.consolidateViewUrl
export default class ConsolidatedService{

    getConsolidatedView(){
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.get(consolidateViewUrl.consolidateViewUrl+"/getProjects",config)    
    }   

    getProjectsModules(project_id,module_id){
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.get(consolidateViewUrl.consolidateViewUrl+"/getProjectsModules/"+project_id+"/"+module_id,config)    
    }   

    getTicketData(project_id,type){    
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.get(consolidateViewUrl.consolidateViewUrl+"/getTicketData/"+project_id+"/"+type,config)
    } 
    
    
    getModulesTicketData(project_id,module_id,type){    
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.get(consolidateViewUrl.consolidateViewUrl+"/getModulesTicketData/"+project_id+"/"+module_id+"/"+type,config)  
    }
    getModulesTaskData(project_id,module_id,type){   
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }; 
        return axios.get(consolidateViewUrl.consolidateViewUrl+"/getModulesTaskData/"+project_id+"/"+module_id+"/"+type,config)
    }

    getTaskData(project_id,type){    
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };

        return axios.get(consolidateViewUrl.consolidateViewUrl+"/getTaskData/"+project_id+"/"+type,config)
    }

}