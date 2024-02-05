import { createAsyncThunk } from "@reduxjs/toolkit";
import DesignationService from "../../../services/MastersService/DesignationService";


export const getDesignationData = createAsyncThunk(
  "getDesignationData",
  async (config, thunkapi) => {
    try {
      const service = new DesignationService();
      const response = await service.getDesignation();

      return response;
    } catch (error) {
      throw error;
    }
  }
);
export const postDesignationData = createAsyncThunk(
  "postDesignationData",
  async (config, thunkapi) => {
    try {
      const service = new DesignationService();
      const response = await service.postDesignation(config);
      console.log("dd", response);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const updatedDesignationData = createAsyncThunk(
  "updatedDesignationData",
  async (config, thunkapi) => {
    console.log("c", config);
    try {
      const service = new DesignationService();
      const response = await service.updateDesignation(config.id, config.payload);
      return response;
    } catch (error) {
      throw error;
    }
  }
);
