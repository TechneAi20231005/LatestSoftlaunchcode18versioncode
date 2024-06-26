import { createAsyncThunk } from "@reduxjs/toolkit";
import CustomerMappingService from "../../../../services/SettingService/CustomerMappingService";
import CustomerTypeService from "../../../../services/MastersService/CustomerTypeService";
import QueryTypeService from "../../../../services/MastersService/QueryTypeService";
import TemplateService from "../../../../services/MastersService/TemplateService";

export const getCustomerMappingData = createAsyncThunk(
  "getCustomerMappingData",
  async (config, thunkapi) => {
    try {
      const service = new CustomerMappingService();
      const response = await service.getCustomerMapping();

      return response;
    } catch (error) {
      throw error;
    }
  }
);
export const exportCustomerMappingData = createAsyncThunk(
  "exportCustomerMappingData",
  async (config, thunkapi) => {
    try {
      const service = new CustomerMappingService();
      const response = await service.exportCustomerMapping();

      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const getcustomerTypeData = createAsyncThunk(
  "getcustomerTypeData",
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

export const getQueryTypeData = createAsyncThunk(
  "getQueryTypeData",
  async (config, thunkapi) => {
    try {
      const service = new QueryTypeService();
      const response = await service.getQueryType();

      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const getTemplateData = createAsyncThunk(
  "getTemplateData",
  async (config, thunkapi) => {
    try {
      const service = new TemplateService();
      const response = await service.getTemplate();
      return response;
    } catch (error) {
      throw error;
    }
  }
);
