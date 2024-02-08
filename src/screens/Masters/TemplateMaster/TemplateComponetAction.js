import { createAsyncThunk } from "@reduxjs/toolkit";
import TemplateService from "../../../services/MastersService/TemplateService";

export const templateData = createAsyncThunk(
    "templateData",
    async (config, thunkapi) => {
      try {
        const service = new TemplateService();
        const response = await service.getTemplate();
        console.log("resss", response);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  export const getParentData = createAsyncThunk(
    "getParentData",
    async (config, thunkapi) => {
      try {
        const service = new TemplateService();
        const response = await service.getParent();
        console.log("resss", response);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  export const getAllTypeData = createAsyncThunk(
    "getAllTypeData",
    async (config, thunkapi) => {
      try {
        const service = new TemplateService();
        const response = await service.getAllType();
      
        return response;
      } catch (error) {
        throw error;
      }
    }
  );