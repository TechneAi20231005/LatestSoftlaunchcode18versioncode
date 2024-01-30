import { createAsyncThunk } from "@reduxjs/toolkit";
import SubModuleService from "../../../services/ProjectManagementService/SubModuleService";

export const subModuleMaster = createAsyncThunk(
    "subModuleMaster",
    async (config, thunkapi) => {
      try {
        const service = new SubModuleService();
        const response = await service.getSubModule();
        console.log("resss", response);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );