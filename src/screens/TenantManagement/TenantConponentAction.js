import { createAsyncThunk } from "@reduxjs/toolkit";

import TenantService from "../../services/MastersService/TenantService";

export const getAllTenant = createAsyncThunk(
  "getAllTenant",
  async (config, thunkapi) => {
    try {
      const service = new TenantService();
      const response = await service.getTenant();
      console.log("response",response);

      return response;
    } catch (error) {
      throw error;
    }
  }
);
export const posttenantData = createAsyncThunk(
  "posttenantData",
  async (config, thunkapi) => {
    try {
      const service = new TenantService();
      const response = await service.postTenant(config);
      console.log("response",response);
  
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const updatetenantData = createAsyncThunk(
  "updatedRole",
  async (config, thunkapi) => {

    try {
      const service = new TenantService();
      const response = await service.updateTenant(config.id, config.payload);
      return response;
    } catch (error) {
      throw error;
    }
  }
);
