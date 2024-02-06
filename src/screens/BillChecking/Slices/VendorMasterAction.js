import { createAsyncThunk } from "@reduxjs/toolkit";
import BillCheckingTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService";
export const getVendorMasterData = createAsyncThunk("getVendorMasterData",async(config,thunkapi)=>{
    try{
        const service = new BillCheckingTransactionService()
        const response = await service.getVendorsDropdown()
        return (response)
    }catch (error){
        throw(error)
    }
})



