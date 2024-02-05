// import { createAsyncThunk } from "@reduxjs/toolkit";
// import GeneralSettingService from "../../services/SettingService/GeneralSettingService";

// export const getGeneralSettingData = createAsyncThunk("getGeneralSettingData",async(config,thunkapi)=>{
//     try{
//         const service = new GeneralSettingService();
//         const response = await service.getGeneralSetting()
//         console.log("reGeneral",response)
//         return (response)
//     }catch (error){
//         throw(error)
//     }
// })



import { createAsyncThunk } from "@reduxjs/toolkit";
import GeneralSettingService from "../../services/SettingService/GeneralSettingService";

export const getGeneralSettingData = createAsyncThunk("getGeneralSettingData",async(config,thunkapi)=>{
    try{
        const service = new GeneralSettingService();
        const response = await service.getGeneralSetting()
        return (response)
    }catch (error){
        throw(error)
    }
})

export const postGeneralSettingData = createAsyncThunk("postGeneralSettingData",async(config,thunkapi)=>{
    try{
        const service = new GeneralSettingService();
        const response = await service.createGeneralSetting(config)
        return (response)
    }catch (error){
        throw(error)
    }
})

export const updateGeneralSettingData = createAsyncThunk("updateGeneralSettingData",async(payload,thunkapi)=>{
    try{
        const service = new GeneralSettingService();
        console.log("c",payload)
        const response = await service.updateGeneralSetting(payload.id,payload.payload)
        return ("response",response)
    }catch (error){
        throw(error)
    }
})

