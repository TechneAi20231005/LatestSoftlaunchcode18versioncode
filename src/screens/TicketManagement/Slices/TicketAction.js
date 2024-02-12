import { createAsyncThunk } from "@reduxjs/toolkit";

import CustomerMappingService from "../../../services/SettingService/CustomerMappingService"
import QueryTypeService from "../../../services/MastersService/QueryTypeService";
import TaskTicketTypeService from "../../../services/MastersService/TaskTicketTypeService";
import DepartmentMappingService from "../../../services/MastersService/DepartmentMappingService";
import MyTicketService from "../../../services/TicketService/MyTicketService";

export const getCustomerMappingsetting = createAsyncThunk(
  "getCustomerMappingsetting",
  async (config, thunkapi) => {
    try {
      const service = new CustomerMappingService();
      const response = await service.getCustomerMappingSettings(config);
      console.log("response",response);

      return response;
    } catch (error) {
      throw error;
    }
  }
);


export const queryTypesData = createAsyncThunk(
    "queryTypesData",
    async (config, thunkapi) => {
      try {
        const service = new QueryTypeService();
        const response = await service.getQueryType();
        console.log("response",response);
  
        return response;
      } catch (error) {
        throw error;
      }
    }
  );
  


  export const getAllQueryGroupData = createAsyncThunk(
    "getAllQueryGroupData",
    async (config, thunkapi) => {
      try {
        const service = new QueryTypeService();
        const response = await service.getAllQueryGroup();
        console.log("responseppp",response);
  
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
        console.log("response",response);
  
        return response;
      } catch (error) {
        throw error;
      }
    }
  );


  export const getDepartmentMappingByEmployeeIdData = createAsyncThunk(
    "getDepartmentMappingByEmployeeIdData",
    async (config, thunkapi) => {
      try {
        const service = new DepartmentMappingService();
        const response = await service.getDepartmentMappingByEmployeeId(config);
        console.log("response",response);
  
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  export const postCreateticket = createAsyncThunk(
    "postCreateticket",
    async (config, thunkapi) => {
      try {
        const service = new MyTicketService();
        const response = await service.postTicket(config);
        console.log("response",response);
  
        return response;
      } catch (error) {
        throw error;
      }
    }
  );


  export const EditCreateticket = createAsyncThunk(
    "EditCreateticket",
    async (config, thunkapi) => {
      try {
        const service = new MyTicketService();
        const response = await service.getTicketById(config);
        console.log("response",response);
  
        return response;
      } catch (error) {
        throw error;
      }
    }
  );