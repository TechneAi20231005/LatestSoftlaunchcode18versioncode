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
import BillCheckingTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService";

export const getGeneralSettingData = createAsyncThunk("getBillcheckinData",async(config,thunkapi)=>{
    try{
        const response = await BillCheckingTransactionService.getBillCheckData()
        return (response)
    }catch (error){
        throw(error)
    }
})

