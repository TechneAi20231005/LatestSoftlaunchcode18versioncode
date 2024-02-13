import { createAsyncThunk } from "@reduxjs/toolkit";
import VendorMasterService from "../../../services/Bill Checking/Masters/VendorMasterService";
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

export const postVendor = createAsyncThunk("postVendor",async(payload,thunkapi)=>{
    try{
        const service = new VendorMasterService()
        const response = await service.createVendor(payload)
        return (response)
    }catch (error){
        throw(error)
    }
})

export const getVendorData = createAsyncThunk("getVendorData",async(payload,thunkapi)=>{
    try{
        const service = new VendorMasterService()
        const response = await service.getVendors()
        return (response)
    }catch (error){
        throw(error)
    }
})


export const PaymentDropDown = createAsyncThunk("PaymentDropDown",async(payload,thunkapi)=>{
    try{
        const service = new VendorMasterService()
        const response = await service.getActivePaymentTemplate()
        return (response)
    }catch (error){
        throw(error)
    }
})


export const BulkUploadVendorData = createAsyncThunk("BulkUploadVendorData",async(payload,thunkapi)=>{
    try{
        const service = new VendorMasterService()
        const response = await service.bulkUploadVendor(payload)
        return (response)
    }catch (error){
        throw(error)
    }
})

export const downloadFormatData = createAsyncThunk("downloadFormat",async(payload,thunkapi)=>{
    try{
        const service = new VendorMasterService()
        const response = await service.downloadBulkFormat()
        return (response)
    }catch (error){
        throw(error)
    }
})
export const getAllActiveState = createAsyncThunk("getAllActiveState",async(payload,thunkapi)=>{
    try{
        const service = new VendorMasterService()
        const response = await service.getActiveState()
        return (response)
    }catch (error){
        throw(error)
    }
})
//___________________updateVendorMaster______________________________


export const updateVendorMaster = createAsyncThunk("updateVendorMaster",async(config,thunkapi)=>{
    try{
        const service = new VendorMasterService()
        const response = await service.updateVendor(config.id,config.payload)
        return (response)
    }catch (error){
        throw(error)
    }
})



