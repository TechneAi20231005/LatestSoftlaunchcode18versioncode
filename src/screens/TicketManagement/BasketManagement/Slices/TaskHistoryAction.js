import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTaskHistory } from "../../../../services/TicketService/TaskService";

export const getTaskHistoryData = createAsyncThunk(
    "getTaskHistoryData", async(config,thunkapi)=>{
        try{
            const response = await getTaskHistory(config)
            return response
        }catch (error) {
            throw error;
          }
    }
);


