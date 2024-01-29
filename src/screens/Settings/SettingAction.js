import { createAsyncThunk } from "@reduxjs/toolkit";
import GeneralSettingService from "../../services/SettingService/GeneralSettingService";

export const getGeneralSettingData = createAsyncThunk("getGeneralSettingData",async(config,thunkapi)=>{
    try{
        const service = new GeneralSettingService();
        const response = await service.getGeneralSetting()
        console.log("reGeneral",response)
        return (response)
    }catch (error){
        throw(error)
    }
})

