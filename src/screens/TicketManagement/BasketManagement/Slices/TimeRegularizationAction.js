import { createAsyncThunk } from "@reduxjs/toolkit";
import { requestRegularizationTime } from "../../../../services/TicketService/TaskService";

export const postTimeRegularizationData = createAsyncThunk(
    "postTimeRegularizationData", async(config,thunkapi)=>{
        try{
            const response = await requestRegularizationTime(config)
            return response
        }catch (error) {
            throw error;
          }
    }
);


