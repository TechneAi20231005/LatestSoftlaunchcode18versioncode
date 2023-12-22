import axios from "axios";
import {reportUrl} from '../../settings/constants';

export default class ReportService{
    getTicketReport(payload){
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.post(reportUrl.ticketReport,payload,config)
    }   

    getUserTaskReport(payload){
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        
        return axios.post(reportUrl.userTaskReport,payload,config)
    }
    
    getTimeLineReport(payload){
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.post(reportUrl.ticketTimelineReport,payload,config)
    }




  //   getTimeLineReportHoursWise(payload){
  //     const token = localStorage.getItem("jwt_token");

  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //     };
  //     return axios.post(reportUrl.hoursWiseTaskRecord,payload,config)
  // }

    getResourcePlanningReport(payload){
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.post(reportUrl.resourcePlanningReport,payload,config)
    }

    // getVariantsReport(){
    //     return axios.post(reportUrl.variantsReport)
    // }
    variantsReport(payload){
        const token = localStorage.getItem("jwt_token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.post(reportUrl.variantsReport,payload,config)
    }

}