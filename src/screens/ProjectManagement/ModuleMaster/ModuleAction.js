import { createAsyncThunk } from "@reduxjs/toolkit";
import ModuleService from "../../../services/ProjectManagementService/ModuleService";

export const moduleMaster = createAsyncThunk(
    "moduleMaster",
    async (config, thunkapi) => {
      try {
        const service = new ModuleService();
        const response = await service.getModule();
        console.log("resss", response);
        return response;
      } catch (error) {
        throw error;
      }
    }
)