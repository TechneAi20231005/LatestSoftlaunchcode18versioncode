import { createAsyncThunk } from "@reduxjs/toolkit";
import TaskTicketTypeService from "../../../services/MastersService/TaskTicketTypeService";


export const taskAndTicketMaster = createAsyncThunk(
    "taskAndTicketMaster",
    async (config, thunkapi) => {
      try {
        const service = new TaskTicketTypeService();
        const response = await service.getAllType();
  
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  export const getParentDropdown = createAsyncThunk(
    "getParentDropdown",
    async (config, thunkapi) => {
      try {
        const service = new TaskTicketTypeService();
        const response = await service.getParent();
    
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  export const postTaskandTicket = createAsyncThunk(
    "postTaskandTicket",
    async (config, thunkapi) => {
      try {
        const service = new TaskTicketTypeService();
        const response = await service.postType(config);
     
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  
  export const updateTaskAndTicketType = createAsyncThunk(
    "updateTaskAndTicketType",
    async (config, thunkapi) => {
      try {
        const service = new TaskTicketTypeService();
        const response = await service._updateType(config.id,config.payload);
     
        return response;
      } catch (error) {
        throw error;
      }
    }
  );