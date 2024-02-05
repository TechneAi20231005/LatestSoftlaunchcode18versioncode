import { createAsyncThunk } from "@reduxjs/toolkit";
import StatusService from "../../../services/MastersService/StatusService";

export const getStatusData = createAsyncThunk(
  "getStatusData",
  async (config, thunkapi) => {
    try {
      const service = new StatusService();
      const response = await service.getStatus();

      return response;
    } catch (error) {
      throw error;
    }
  }
);
export const postStatusData = createAsyncThunk(
  "postStatusData",
  async (config, thunkapi) => {
    try {
      const service = new StatusService();
      const response = await service.postStatus(config);
      console.log("dd", response);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const updateStatusData = createAsyncThunk(
  "updateStatusData",
  async (config, thunkapi) => {
    console.log("c", config);
    try {
      const service = new StatusService();
      const response = await service.updateStatus(config.id, config.payload);
      return response;
    } catch (error) {
      throw error;
    }
  }
);
