import { createAsyncThunk } from "@reduxjs/toolkit";
import BasketService from "../../../services/TicketService/BasketService";
import {
  getTaskData,
  postTask,
  postTimerData,
  updateTask,
} from "../../../services/TicketService/TaskService";
import SubtaskService from "../../../services/TicketService/SubtaskService";
import ModuleSetting from "../../../services/SettingService/ModuleSetting";



export const getBasketTaskData = createAsyncThunk(


  "getBasketTaskData",
  async (config) => {
    try {
      const service = new BasketService();
      const response = await service.getBasketTaskData(config);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const getAllTaskData = createAsyncThunk(
  "getAllTaskData",
  async (config, thunkapi) => {
    try {
      const response = await getTaskData(config);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const taskModal = createAsyncThunk(
  "taskModal",
  async (config, thunkapi) => {
    try {
      const response = await postTask(config);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const updatetaskModal = createAsyncThunk(
  "updatetaskModal",
  async (config, thunkapi) => {
    try {
      const response = await updateTask(config.id, config.payload);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const updateBasketDetails = createAsyncThunk(
  "updateBasketDetails",
  async (config, thunkapi) => {
    try {
      const service = new BasketService();
      const response = service.updateBasket(config.id, config.payload);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const PostTimerDataChange = createAsyncThunk(
  "PostTimerDataChange",
  async (payload, thunkapi) => {
    try {
      const response = await postTimerData(payload);

      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const postSubTask = createAsyncThunk(
  "taskModal",
  async (config, thunkapi) => {
    try {
      const service = new SubtaskService();
      const response = await service.postSubtask(config);
      return response;
    } catch (error) {
      throw error;
    }
  }
);


export const getBasketByIdData = createAsyncThunk(
  "getBasketByIdData",
  async (config, thunkapi) => {
    try {
      const service = new BasketService();
      const response = await service.getBasketById(config);
      return response;
    } catch (error) {
      throw error;
    }
  }
);






export const getmoduleSetting = createAsyncThunk(
  "getmoduleSetting",
  async ({module_name,submodule_name}, thunkapi) => {
    try {
      const service = new ModuleSetting();
      const response = await service.getSettingByName(module_name,submodule_name);

      return response;
    } catch (error) {
      throw error;
    }
  }
);
