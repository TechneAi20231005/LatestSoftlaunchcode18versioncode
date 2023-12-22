import { useEffect, useState } from "react"


const useOnlineStatus = () =>{
    const [onlineStatus, setOnlineStatus] = useState(true)
    //check if the user is online or not 
    useEffect(()=>{
        window.addEventListener('offline',()=>{
            setOnlineStatus(false)
        })
        window.addEventListener('online',()=>{
            setOnlineStatus(true)
        })
    },[])
    //return boolean
    return onlineStatus
}

export default useOnlineStatus