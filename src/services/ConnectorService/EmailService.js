import axios from "axios";
import {connectorUrl} from '../../settings/constants';
import {getDateTime} from '../../components/Utilities/Functions'

const _URL=connectorUrl.connector;

export default class EmailService{

    getEmailVendors(){
        const token = localStorage.getItem("jwt_token");
      
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.get(_URL+"/vendor",config);
    }
    
    activeVendor(id,type,status){
        var payload = ({"connector_id":id,"type":type,"user_id":localStorage.getItem('id'),"created_at":getDateTime(), "is_active":1,"created_by":localStorage.getItem('id'), "status":status});
        const token = localStorage.getItem("jwt_token");
      
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return axios.post(_URL+"/connector",payload,config)
    }    
}