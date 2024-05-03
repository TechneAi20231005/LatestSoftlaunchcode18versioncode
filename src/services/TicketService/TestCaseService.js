import axios from "axios";
import {connectorUrl, masterURL, ticketUrl} from '../../settings/constants';
// import {getDateTime} from '../../components/Utilities/Functions'
import {userSessionData} from '../../settings/constants';

const userId = userSessionData.userId;
const _URL=connectorUrl.testcaseUrl;
const _TestSuiteURL=connectorUrl.testSuiteUrl;
const URL = _URL
const __URL = ticketUrl.basket
const ticketMasterURL = ticketUrl.ticket
const desig = masterURL.designation
const updatetestcase = connectorUrl.testcaseUpdateUrl

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
export default class TestCasesService{
    // readOnly={ noneditableItems && noneditableItems.length > 0 && noneditableItems.includes("TesterStatus") }

    getLastId(ticket_id,task_id){
      const token = localStorage.getItem("jwt_token");
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };


      

      
      
        return axios.get(_URL+"/getLastId/"+ticket_id+"/"+task_id,config);
    }

    getTaskBytTicket(ticketId){

      const token = localStorage.getItem("jwt_token");
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

        return axios.get(_URL+"/getTaskByTicket/"+ticketId,config);
    }

    getTestCases(userId,ticket_id,task_id, payload){
      const token = localStorage.getItem("jwt_token");
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      
        return axios.post(URL+"/"+userId+"/"+ticket_id + "/"+ task_id, payload,config);
    }

// created by Asmita - To show the function data in function field dropdown
    getTestcasesFunction(){
      const token = localStorage.getItem("jwt_token");
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      
        return axios.get(_URL+"/getTestcasesFunction",config);
    }




    getTestCasesByTicket(userId,ticket_id, payload){
      const token = localStorage.getItem("jwt_token");
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

        return axios.post(URL+"/"+userId+"/"+ticket_id, payload,config );
    }


    getTestcasesByFilter(payload)
    {
      payload.append('tenant_id', userSessionData.tenantId)
      const token = localStorage.getItem("jwt_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },

    };

      return axios.post(_TestSuiteURL+"/getTestCases", payload,config)
  }
    

    postTestCases(payload){
     
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

        return axios.post(_URL+"/submitTestCases",payload,config)
       
    }   
    
    getReviewTestCases(payload){  
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

        return axios.post(_URL+"/getReviewTestCases",payload,config)
       
    }

    updateTestCases(id,payload){
         payload.append('tenant_id',userSessionData.tenantId);
        payload.append('updated_by',userSessionData.userId);
        payload.append('updated_at',userSessionData.time);
        const token = localStorage.getItem("jwt_token");
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

        return axios.post(updatetestcase+"/updateTestCases/"+id, payload,config)
    }

    uploadTestCase(payload){ 
      const token = localStorage.getItem("jwt_token");
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      

        return axios.post(_URL+"/importTestCase",payload,config)
    }

    getAssignTestCasesToTesters(payload){ 
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

        return axios.post(_URL+"/getAssignTestCasesTo",payload,config)
    }
    ticketId
    
    downloadBulkFormat(){
      const token = localStorage.getItem("jwt_token");
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

        return axios.get(_URL+"/BulkFormat",config)
    }

    getHistory(id){
      const token = localStorage.getItem("jwt_token");
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

        return axios.get(_URL+"/getTestCaseHistory/"+id,config)
    }

    createTestSuite(payload){
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
        return axios.post(_TestSuiteURL+"/createTestsuit",payload,config)
       
    }   


    addToExistingTestSuite(payload){
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
        return axios.post(_URL+"/getAddToTestSuit",payload,config)
       
    }   

    getAllTestSuites(){
      const token = localStorage.getItem("jwt_token");
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

        return axios.get(_TestSuiteURL+"/getAllTestsuit",config);
    }

    getAllTicketId(){
      const token = localStorage.getItem("jwt_token");
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

        return axios.get(ticketMasterURL+"/getAllTicketId",config)
    }

    getTestcasesByFilter(payload){
        payload.append('tenant_id', userSessionData.tenantId)
        const token = localStorage.getItem("jwt_token");
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

        return axios.post(_TestSuiteURL+"/getTestCases", payload,config)
    }
    
    sendNotificationToMulti(payload){
      const token = localStorage.getItem("jwt_token");
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

        payload.append('created_by', userSessionData.userId)
        return axios.post(_URL+"/sendNotification", payload,config)
    }

    getAssignTestCasesToTester(payload){
        payload.append('tenant_id',userSessionData.tenantId)
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

        return axios.post( _URL+"/getAssignTestCasesToTester", payload,config)

    }

    getBasketTasksData(id,userId, type){
        // const userId=localStorage.getItem('id');
        const token = localStorage.getItem("jwt_token");
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

        return axios.get(__URL+"/"+id+"/"+userId+ "/"+type,config);
    }
    
    getdesignatedDropdown(ticketId){
      
        const token = localStorage.getItem("jwt_token");
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
        return axios.get(desig +"/getdesignatedDropdown/"+ticketId, config);
    }

    
}