import axios from "axios";
import {reportUrl} from '../../settings/constants';
import {userSessionData} from '../../settings/constants';

// const _URL =reportUrl.consolidatedView
// const _getConsolidatedView =_URL+"/ConsolidatedView/"+userSessionData.tenantId;    

export default class ConsolidatedView{
    getConsolidatedView(){
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.get(reportUrl.consolidatedView,config)
        
    }   

    // getUserTaskReport(payload){
        
    //     return axios.get(reportUrl.userTaskReport,payload)
    // }
    
    // getTimeLineReport(payload){
    //     return axios.get(reportUrl.ticketTimelineReport,payload)
    // }

    // getResourcePlanningReport(payload){
    //     return axios.get(reportUrl.resourcePlanningReport,payload)
    // }

}