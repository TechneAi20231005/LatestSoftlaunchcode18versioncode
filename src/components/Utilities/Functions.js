export function getCurrentDate(separator='-'){
    let newDate = new Date()
    let day = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${day < 10 ? `0${day}`:`${day}`}`;
    // return `${date < 10 ? `0${date}`:`${date}`}${separator}${month < 10 ? `0${month}`:`${month}`}${separator}${year}`
}

export function getFormattedDate(date,format,separator){
    let newDate = new Date(date)
    let day = newDate.getDate();
    let month = newDate.getMonth()+1 ;
    let year = newDate.getFullYear();
    if(format==="dd-mm-yyyy")
    {
        return `${day < 10 ? `0${day}`:`${day}`}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${year}`;
    }
    if(format==="yyyy-mm-dd")
    {
        return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${day < 10 ? `0${day}`:`${day}`}`;
    }
   
}

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

export function getTime(){
    var now = new Date(); 
    let year=now.getFullYear();
    let month=now.getMonth()+1;
        month= month  >= 10 ?  month : `0${month}`
    let day=now.getDate() >= 10 ? now.getDate() : `0${now.getDate()}`
    let hour=now.getHours() >= 10 ? now.getHours() : `0${now.getHours()}`
    let min=now.getMinutes() >= 10 ? now.getMinutes() : `0${now.getMinutes()}`
    let sec=now.getSeconds() >= 10 ? now.getSeconds() : `0${now.getSeconds()}`
    var datetime=hour+':'+min+':'+sec;
    return datetime;
}

