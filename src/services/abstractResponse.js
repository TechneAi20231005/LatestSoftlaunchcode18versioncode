
let data={
    status:0,
    message:null,
    data:null,
}

export function responseModifier(response){
    if(response.data)
    {
        data.status=1;
        data.message=response.data.message;
        data.data=response.data;
    }
    return data;
}

export function errorModifier(error){
    if (error.response.status==401){
        data.status=error.response.data.status;
        data.message=error.response.data.message;
        data.data=null;
        
      }else {
        data.status=error.response.data.status;
        data.message=error.response.data.message;
        data.data=null;
      }
      return data;
}

