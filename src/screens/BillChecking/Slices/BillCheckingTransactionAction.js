import { createAsyncThunk } from "@reduxjs/toolkit";
import BillCheckingTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService";
import BillTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService"
import DropdownService from "../../../services/Bill Checking/Bill Checking Transaction/DropdownService";
export const getBillcheckingData = createAsyncThunk("getBillcheckingData",async(config,thunkapi)=>{
    try{
        const service = new BillCheckingTransactionService()
        const response = await service.getBillCheckData()
        return (response)
    }catch (error){
        throw(error)
    }
})


export const postBillcheckingData = createAsyncThunk("postBillcheckingData",async(payload,thunkapi)=>{
    try{
        const service = new BillCheckingTransactionService()
        const response = await service.createData(payload)
        return (response)
    }catch (error){
        throw(error)
    }
})


export const getUpdatedAuthoritiesData = createAsyncThunk("getUpdatedAuthoritiesData",async(config,thunkapi)=>{
    try{
        const service = new BillCheckingTransactionService()
        const response = await service.getUpdatedAuthorities()
  

        return (response)
    }catch (error){
        throw(error)
    }
})


export const UpdateBillCheckingTransaction = createAsyncThunk("UpdateBillCheckingTransaction",async(payload,thunkapi)=>{
    try{
        const service = new BillTransactionService()
        const response = await service.updateBillChecking(payload.id,payload.form)
        return (response)
    }catch (error){
        throw(error)
    }
})

export const getcreateAuthoritiesData = createAsyncThunk("getcreateAuthoritiesData",async(config,thunkapi)=>{
    try{
        const service = new BillCheckingTransactionService()
        const response = await service.getBillCreateAuthority()
        return (response)
    }catch (error){
        throw(error)
    }
})

export const billTypeDataDropDowm = createAsyncThunk("billTypeDataDropDowm",async(config,thunkapi)=>{
    try{
        const service = new BillCheckingTransactionService()
        const response = await service._getBillTypeDataDropdown()
        return (response)
    }catch (error){
        throw(error)
    }
})

export const statusDropDownData = createAsyncThunk("statusDropDownData",async(config,thunkapi)=>{
    try{
        const service = new DropdownService()
        const response = await service.getBillCheckingStatus()
        return (response)
    }catch (error){
        throw(error)
    }
})


export const mappEmployed = createAsyncThunk("mappEmployed",async(config,thunkapi)=>{
    try{
        const service = new DropdownService()
        const response = await service.getMappedEmp()
        return (response)
    }catch (error){
        throw(error)
    }
})

export const BillcheckingpostData = createAsyncThunk("BillcheckingpostData",async(config,thunkapi)=>{
    try{
        const service = new BillCheckingTransactionService()
        const response = await service.filterBillCheckingData(config)
        return (response)
    }catch (error){
        throw(error)
    }
})





