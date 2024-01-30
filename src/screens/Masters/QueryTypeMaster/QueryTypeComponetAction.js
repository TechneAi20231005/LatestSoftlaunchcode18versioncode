import { createAsyncThunk } from "@reduxjs/toolkit";
import QueryTypeService from "../../../services/MastersService/QueryTypeService";



export const queryTypeData = createAsyncThunk(
    "queryTypeData",
    async (config, thunkapi) => {
      try {
        const service = new QueryTypeService();
        const response = await service.getAllQueryGroup();
        console.log("resss", response);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );
  
  export const queryType = createAsyncThunk(
    "queryType",
    async (config, thunkapi) => {
      try {
        const service = new QueryTypeService();
        const response = await service.getQueryType();
        console.log("resss", response);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );