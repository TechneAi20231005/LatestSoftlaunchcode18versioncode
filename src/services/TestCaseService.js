// import axios from "axios";
// import {connectorUrl} from '../settings/constants';
// import {getDateTime} from '../components/Utilities/Functions'
// import {userSessionData} from '../settings/constants';


// const _URL=connectorUrl.testcaseUrl;

// export default class TestCasesService{

//     // postTestcase(module_id,submodule_id,payload){ 
//     //     payload.append('module_id',module_id) 
//     //     payload.append('submodule_id',submodule_id) 
//     //     payload.append('tenant_id',localStorage.getItem('tenant_id')) 
//     //     payload.append('created_by',localStorage.getItem('id'))
//     //     payload.append('created_at',getDateTime())
//     //     return axios.post(_URL,payload)
//     // }

//     // getTestcase(module_id, submodule_id){  
//     //     if(submodule_id != ""){
//     //         return axios.get(_URL+"/"+module_id+"/"+submodule_id);
//     //     } else{
//     //         return axios.get(_URL+"/"+module_id);
//     //     }        
//     // }

//     // deleteTestcase(module_id, submodule_id){  
//     //     if(submodule_id != ""){
//     //         return axios.delete(_URL+"/"+module_id+"/"+submodule_id);
//     //     } else{
//     //         return axios.delete(_URL+"/"+module_id);
//     //     }        
//     // }

//     getLastId(){
//         return axios.get(_URL)
//     }

//     getTestCases(ticket_id){
//         return axios.get(_URL+"/"+ticket_id)
//     }

//     postTestCases(payload){ 
//         payload.append('tenant_id',userSessionData.tenantId);
//         payload.append('created_by',userSessionData.userId);
//         payload.append('created_at',userSessionData.time);  
//         return axios.post(_URL+"/submitTestCases",payload)
//     }

//     updateTestCases(id,payload){
//         payload.append('updated_by',userSessionData.tenantId);
//         payload.append('updated_at',userSessionData.time);
//         return axios.post(_URL+"/updateTestCases/"+id, payload)
//     }

// }