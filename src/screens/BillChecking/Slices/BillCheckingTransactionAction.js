import { createAsyncThunk } from "@reduxjs/toolkit";
import BillCheckingTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService";
import BillTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService"
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


export const getUpdatedAuthoritiesData = createAsyncThunk("getUpdatedAuthoritiesData",async(payload,thunkapi)=>{
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

export const getcreateAuthoritiesData = createAsyncThunk("getcreateAuthoritiesData",async(payload,thunkapi)=>{
    try{
        const service = new BillCheckingTransactionService()
        const response = await service.getBillCreateAuthority()
        return (response)
    }catch (error){
        throw(error)
    }
})

