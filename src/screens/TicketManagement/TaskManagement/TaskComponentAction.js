import { createAsyncThunk } from "@reduxjs/toolkit";
import BasketService from "../../../services/TicketService/BasketService";
import {getTaskData} from "../../../services/TicketService/TaskService"
export const getBasketTaskData = createAsyncThunk(
    "getBasketTaskData", async(config,thunkapi)=>{
        try{
            const service = new BasketService();
            const response = await service.getBasketTaskData(config)
            return response
        }catch (error) {
            throw error;
          }
    }
);


export const getAllTaskData = createAsyncThunk(
    "getAllTaskData", async(config,thunkapi)=>{
        try{
            const response = await getTaskData(config)
            console.log("reB",response)
            return response
        }catch (error) {
            throw error;
          }
    }
);

