import { createAsyncThunk } from "@reduxjs/toolkit";

import CustomerTypeService from "../../../services/MastersService/CustomerTypeService";
export const getCustomerTypeData = createAsyncThunk(
  "getCustomerTypeData",
  async (config, thunkapi) => {
    try {
      const service = new CustomerTypeService();
      const response = await service.getCustomerType();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const postCustomerData = createAsyncThunk(
  "postCustomerData",
  async (config, thunkapi) => {
    try {
      const service = new CustomerTypeService();
      const response = await service.postCustomerType(config);
      return response;
    } catch (error) {
      throw error;
    }
  }
);
export const updateCustomerData = createAsyncThunk(
  "updateCustomerData",
  async (config, thunkapi) => {
    try {
      const service = new CustomerTypeService();
      const response = await service.updateCustomerType(config.id, config.payload);
    
      return response;
    } catch (error) {
      throw error;
    }
  }
);