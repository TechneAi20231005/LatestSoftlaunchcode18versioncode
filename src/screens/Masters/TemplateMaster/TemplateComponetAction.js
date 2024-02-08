import { createAsyncThunk } from "@reduxjs/toolkit";
import TemplateService from "../../../services/MastersService/TemplateService";
import TaskTicketTypeService from "../../../services/MastersService/TaskTicketTypeService";

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
        const service = new TaskTicketTypeService();
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
        const service = new TaskTicketTypeService();
        const response = await service.getAllType();
        console.log("pppppppppp",response);
      
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  //_____________postTemplate______________________

  export const postTemplateData = createAsyncThunk(
    "postTemplateData",
    async (config, thunkapi) => {
      try {
        const service = new TemplateService();
        const response = await service.postTemplate(config);
        console.log("pppppppppp",response);
      
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

