import axios from "axios";
import {menuManagementUrl} from '../../settings/constants';
import { getDateTime } from "../../components/Utilities/Functions";
const _URL=menuManagementUrl.menusUrl;


export default class ManageMenuService{
    
    getAllMenu(){
        var tenant_id = localStorage.getItem('tenant_id');
        const token = localStorage.getItem("jwt_token");
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.get(_URL+"/getAllMenu",config);
    }

    getRole(role_id){
        const token = localStorage.getItem("jwt_token");
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.get(_URL+"/getRole/"+role_id,config);
    }

    postData(payload){
        // payload.append('tenant_id',localStorage.getItem('tenant_id'));
        // payload.append('created_by',localStorage.getItem('id'));
        // payload.append('created_at',getDateTime());  
        const token = localStorage.getItem("jwt_token");
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };

        payload={...payload,'tenant_id':localStorage.getItem('tenant_id'),'created_by':localStorage.getItem('id'),'created_at':getDateTime()}
        return axios.post(_URL+"/createAccess",payload,config)
    }
    
}