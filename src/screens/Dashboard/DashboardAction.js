import { createAsyncThunk } from "@reduxjs/toolkit";
import CityService from "../../services/MastersService/CityService";
import CountryService from "../../services/MastersService/CountryService";
import StateService from "../../services/MastersService/StateService";
import UserService from "../../services/MastersService/UserService";
import { getNotification } from "../../services/NotificationService/NotificationService";
import { getData } from "../../services/DashboardService";
export const getCityData = createAsyncThunk("getCityData",async(config,thunkapi)=>{
    try{
        const service = new CityService();
        const response = await service.getCity()
        return (response)
    }catch (error){
        throw(error)
    }
})


export const getCountryData = createAsyncThunk("getCountryData",async(config,thunkapi)=>{
    try{
        const service = new CountryService();
        const response = await service.getCountry()
        return (response)
    }catch (error){
        throw(error)
    }
})

export const getStateData = createAsyncThunk("getStateData",async(config,thunkapi)=>{
    try{
        const service = new StateService();
        const response = await service.getState()
            
        return (response)
    }catch (error){
        throw(error)
    }
})

export const getEmployeeData = createAsyncThunk("getEmployeeData",async(config,thunkapi)=>{
    try{
        const service = new UserService();
        const response = await service.getUser()
            
        return (response)
    }catch (error){
        throw(error)
    }
})


export const getNotifications = createAsyncThunk("getNotifications",async(config,thunkapi)=>{
    try{
        const response = await getNotification()
            console.log("responseN",response)
        return (response)
        
    }catch (error){
        throw(error)
    }
})


export const getAllDashboardData = createAsyncThunk("getAllDashboardData",async(config,thunkapi)=>{
    try{
        const response = await getData()
            console.log("responseN",response)
        return (response)
        
    }catch (error){
        throw(error)
    }
})