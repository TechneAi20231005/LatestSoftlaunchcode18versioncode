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

export const cancelBillCheckData = createAsyncThunk("cancelBillCheckData",async(config,thunkapi)=>{
    try{
        const service = new BillCheckingTransactionService()
        const response = await service.cancelBill(config.id)
        return (response)
    }catch (error){
        throw(error)
    }
})
export const sectionDropDownData = createAsyncThunk("sectionDropDownData",async(config,thunkapi)=>{
    try{
        const service = new BillCheckingTransactionService()
        const response = await service.getSectionDropdown()
        return (response)
    }catch (error){
        throw(error)
    }
})

//____________________________getAllAuthority_____________________________


export const getModuleSettingData = createAsyncThunk(
    "getModuleSettingData",
    async (config, thunkapi) => {
      try {
        const service = new BillCheckingTransactionService();
        const response = await service.getModuleSetting();
        console.log("responseauthority",response)
      
  
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  //_______________________subModulename________________________


  export const getSubmoduleData = createAsyncThunk(
    "getSubmoduleData",
    async (config, thunkapi) => {
      try {
        const service = new BillCheckingTransactionService();
        const response = await service.getSubmodule(41);
        console.log("getSubmoduleData",getSubmoduleData)
     
  
        return response;
      } catch (error) {
        throw error;
      }
    }
  );
  //_____________________AuthorittyMappingPost________________________

  export const creteAuthority = createAsyncThunk(
    "creteAuthority",
    async (config, thunkapi) => {
      try {
        const service = new BillCheckingTransactionService();
        const response = await service.createModuleAuthorityUserSetting(config);
     
  
        return response;
      } catch (error) {
        throw error;
      }
    }
  );
  //______________________updateAuthorites______________

  export const updateAuthority = createAsyncThunk(
    "updateAuthority",
    async (config, thunkapi) => {
      try {
        const service = new BillCheckingTransactionService();
        const response = await service.getUpdatedAuthorities();
     
  
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

















