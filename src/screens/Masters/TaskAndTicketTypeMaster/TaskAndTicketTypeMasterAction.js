import { createAsyncThunk } from "@reduxjs/toolkit";
import TaskTicketTypeService from "../../../services/MastersService/TaskTicketTypeService";


export const taskAndTicketMaster = createAsyncThunk(
    "taskAndTicketMaster",
    async (config, thunkapi) => {
      try {
        const service = new TaskTicketTypeService();
        const response = await service.getAllType();
        console.log("resss", response);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );