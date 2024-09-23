import { createAsyncThunk, current } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customAxios from "../../../http/axios";
import { errorHandler } from "../../../utils";
import {useParam} from 'react-router-dom'

export const getJobRoleMasterListThunk=createAsyncThunk(
    'jobRoleMaster/getJobRoleMasterList',
    async ()=>{
        try{
            const response=await customAxios.get(
                `jobRoleMaster/getJobRole/1`
            );
            if(response?.status===200 || response?.status===201){
                console.log(response.data)
                if(response?.data?.status===1){
                    return {data:response?.data?.data, msg:response?.data?.message};
                }else{
                    errorHandler(response)
                    
                }
            }
        }catch(error){
            errorHandler(error?.response);
            return Promise.reject(error?.response?.data?.message)
        }
    }
);

export const addJobRoleMasterThunk=createAsyncThunk(
    'jobRoleMaster/addJobRole',
    async({formData,onSuccessHandler,onErrorHandler})=>{
        try{
            const response=await customAxios.post(
                `/postJobRole`,formData
            );
            if(response?.status===200 || response?.status===201){
                if(response?.data?.status===1){
                    onSuccessHandler();
                    toast.success(response?.data?.message);
                    return response?.data?.message;
                }else{
                    onErrorHandler();
                    errorHandler(response);
                }
            }
        }catch(error){
            onErrorHandler();
            errorHandler(error?.response);
            return Promise.reject(error?.response?.data?.message)
        }
    }
);

export const editJobRoleMasterThunk=createAsyncThunk(
    'jobRoleMaster/editJobRole',
    async({formData,onSuccessHandler,onErrorHandler,id})=>{
        try{
            const response=await customAxios.post(
                `/postJobRole/${id}`,formData
            );
            if(response?.status===200 || response?.status===201){
                if(response?.data?.status===1){
                    onSuccessHandler();
                    toast.success(response?.data?.message)
                    return response?.data?.message;
                }else{
                    onErrorHandler();
                    errorHandler(response)
                }
            }
        }catch(error){
            onErrorHandler();
            errorHandler(error?.response);
            return Promise.reject(error?.response?.data?.message)
        }
    }
);