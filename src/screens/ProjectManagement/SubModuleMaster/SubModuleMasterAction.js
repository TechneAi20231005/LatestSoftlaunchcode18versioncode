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

  export const postSubModuleMaster = createAsyncThunk(
    "postSubModuleMaster",
    async (config, thunkapi) => {
      try {
        const service = new SubModuleService();
        const response = await service.postSubModule(config);
        console.log("sub", response);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  export const updatesubModuleMaster = createAsyncThunk(
    "updatesubModuleMaster",
    async (config, thunkapi) => {
      try {
        const service = new SubModuleService();
        const response = await service.updateSubModule(config.id, config.payload);;
        console.log("resss", response);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  export const getSubModuleById = createAsyncThunk(
    "getSubModuleById",
    async (config, thunkapi) => {
      try {
        const service = new SubModuleService();
        const response = await service.getSubModuleById(config.id);;
        console.log("resss", response);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );
  