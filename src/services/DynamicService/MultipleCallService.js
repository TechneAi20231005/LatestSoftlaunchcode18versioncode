import axios from "axios";
import {_ErrorMsg} from '../../settings/constants';

const dataFormat=[];

export async function callMultipleURL(URL){

    const request=[];
    for(var i=0;i<URL.length;i++){
        request.push(axios.get(URL[2].url));  
    }

    await axios.all(URL).then(axios.spread((...responses) => {            
            for(var i=0;i<URL.length;i++)
            {   
                if(responses[i].data && responses[i].data.status==1){
                    URL[i].data=responses[i].data.data
                }
            }
        })
      )
    return URL;

}
