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

  export const QueryGroupForm = createAsyncThunk(
    "QueryGroupForm",
    async (config, thunkapi) => {
      try {
        const service = new QueryTypeService();
        const response = await service.postQueryGroup(config);
        console.log("resss", response);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  export const QueryGroupFormUpdate = createAsyncThunk(
    "QueryGroupFormUpdate",
    async (config, thunkapi) => {
      try {
        const service = new QueryTypeService();
        const response = await service.updateQueryGroup(config.id,config.payload);
        console.log("resss", response);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );
  // ________________updateQueryType______________________

  export const updateQueryTypeData = createAsyncThunk(
    "updateQueryTypeData",
    async (config, thunkapi) => {
      try {
        const service = new QueryTypeService();
        const response = await service.updateQueryType(config.id,config.payload);
        console.log("resss", response);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );
  //_______________postqueryType_______________


  export const postqueryTypeForm = createAsyncThunk(
    "postqueryTypeForm",
    async (config, thunkapi) => {
      try {
        const service = new QueryTypeService();
        const response = await service.postQueryType(config);
        console.log("resss", response);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  