import axios from "axios";

import {userSessionData} from '../../settings/constants';
import {masterURL} from '../../settings/constants';
import {getDateTime} from '../../components/Utilities/Functions'

const _URL=masterURL.dynamicForm;

const _getAllDynamicForm=_URL+"/getAllDynamicForm";
   
const _createDynamicForm=_URL+"/createDynamicForm";    
const _updateDynamicForm=_URL+"/updateDynamicForm/"; 
const _getDynamicFormById=_URL+"/getDynamicFormById/";




export default class DynamicFormService{

//     getDynamicForm(){
//        return axios.get(_getAllDynamicForm);
//    }

getDynamicForm() {
    const token = localStorage.getItem("jwt_token");
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
  
    return axios.get(_getAllDynamicForm, config);
  }
  

   
    postDynamicForm(payload){
        payload={...payload,'tenant_id':userSessionData.tenantId,
                    'created_by':userSessionData.userId,
                    'created_at':userSessionData.time
                }


        // return axios.post(_createDynamicForm,payload,{ 'Content-Type':"application/json"  })
        const token = localStorage.getItem("jwt_token");
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
      
        return axios.post(_createDynamicForm,payload, config);
      }
   
   
//     getDynamicFormById(id){
//        return axios.get(_getDynamicFormById+id);
//    }
getDynamicFormById(id) {
    const token = localStorage.getItem("jwt_token");
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
  
    return axios.get(_getDynamicFormById+id, config);
  }
  








   
    updateDynamicForm(id,payload){
        payload={...payload,'updated_by':userSessionData.userId,'updated_at':userSessionData.time}
        // return axios.post(_updateDynamicForm+id,payload,{'Content-Type':"application/json"})


        const token = localStorage.getItem("jwt_token");
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
  
    return axios.post(_updateDynamicForm+id,payload ,config);
  }
  
   }



// export function getData(){
//     return axios.get(_URL)
// }

// export function postData(payload){
//     payload={...payload,'created_by':localStorage.getItem('id'),'created_at':getDateTime()}
    
//     return axios.post(_URL,payload,{
//         'Content-Type':"application/json"
//     })
// }

// export function getDataUsingParam(id){
//     return axios.get(_URL+"/"+id)
// }

// export function putData(id,payload){
//     payload={...payload,'updated_by':localStorage.getItem('id'),'updated_at':getDateTime()}
//     return axios.put(_URL+"/"+id,payload,{
//         'Content-Type':"application/json"
//     })
// }