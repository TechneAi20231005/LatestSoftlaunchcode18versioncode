import axios from "axios";
import {_ErrorMsg,dataFormat} from '../../settings/constants';

export async function getData(_URL){
    const token = localStorage.getItem("jwt_token");
      
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    await axios.get(_URL,config)
    .then(response => {
        if(response.data){
            dataFormat.status=response.data.status;
            dataFormat.message=response.data.message;
            dataFormat.data=response.data.data;
        }
    })
    .catch(error => {
       dataFormat.status=202;
       dataFormat.message=_ErrorMsg;
       dataFormat.data=null;
    })
    return dataFormat;
}
