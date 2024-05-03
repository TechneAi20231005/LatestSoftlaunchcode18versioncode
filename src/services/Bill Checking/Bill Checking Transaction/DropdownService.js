import axios from "axios";
import {userSessionData} from '../../../settings/constants';
import {billCheckingMasterUrl} from '../../../settings/constants';

const _URL = billCheckingMasterUrl.billChecking
const _getMapped=_URL+"/getBillTypeMappedEmp/";     




export default class DropdownService{

    getDropdown(){
      const token = localStorage.getItem("jwt_token");
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
        return axios.get(_URL+"/getPaymentStatusDropdown",config);
    }
    
    getMappedEmp(id){
      const token = localStorage.getItem("jwt_token");
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

        // return axios.get(_URL+"/getBillTypeMappedEmp/"+id);
        return axios.get(_getMapped+id,config)
    }  
    
    getBillCheckingStatus(){
      const token = localStorage.getItem("jwt_token");
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
        return axios.get(_URL+"/getBillCheckingStatus",config);
    }
    
}