import UserService from "../../services/MastersService/UserService";

const mentions = [];
const inputRequired = 'id,employee_id,first_name,last_name,middle_name,is_active';

  new UserService().getUserForMyTickets(inputRequired).then((res) => {
    if (res.status === 200) {
      var data =[]
      if (Array.isArray(res.data)) {
       data = res.data.data.filter(d=> d.is_active);
      }
      for (const key in data) {

        mentions.push({
          name: '@'+data[key].first_name+' '+data[key].last_name +" ("+ data[key].id +")"+":",
          id: data[key].id ,
        });
        
      }
    }
  });
  
export default mentions;