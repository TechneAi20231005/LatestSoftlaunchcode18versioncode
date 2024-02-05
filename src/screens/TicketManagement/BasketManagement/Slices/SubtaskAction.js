import { createAsyncThunk } from "@reduxjs/toolkit";
import SubtaskService from "../../../../services/TicketService/SubtaskService";

export const postSubtaskData = createAsyncThunk(
    "postSubtaskData", async(config,thunkapi)=>{
        try{
            const service = new SubtaskService();
            const response = await service.postSubtask(config)
            return response
        }catch (error) {
            throw error;
          }
    }
);


export const getSubTaskData = createAsyncThunk(
    "getSubTaskData", async(config,thunkapi)=>{
        try{
            const service = new SubtaskService();
            const response = await service.getSubtask(config)
            return response
        }catch (error) {
            throw error;
          }
    }
);

export const CompleteSubtask = createAsyncThunk(
    "CompleteSubtask", async(config,thunkapi)=>{
        try{
            const service = new SubtaskService();
            const response = await service.completeSubtask(config.subtaskId,config.payload)
            return response
        }catch (error) {
            throw error;
          }
    }
);


export const DeleteSubtask = createAsyncThunk(
    "DeleteSubtask", async(config,thunkapi)=>{
        try{
            const service = new SubtaskService();
            const response = await service.deleteSubtask(config.subtaskId,config.payload)
            return response
        }catch (error) {
            throw error;
          }
    }
);