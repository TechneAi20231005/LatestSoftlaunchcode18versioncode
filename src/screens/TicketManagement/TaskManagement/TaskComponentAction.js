// import { createAsyncThunk } from "@reduxjs/toolkit";
// import BasketService from "../../../services/TicketService/BasketService";
// import {getTaskData} from "../../../services/TicketService/TaskService"
// export const getBasketTaskData = createAsyncThunk(
//     "getBasketTaskData", async(config,thunkapi)=>{
//         try{
//             const service = new BasketService();
//             const response = await service.getBasketTaskData(config)
//             return response
//         }catch (error) {
//             throw error;
//           }
//     }
// );


// export const getAllTaskData = createAsyncThunk(
//     "getAllTaskData", async(config,thunkapi)=>{
//         try{
//             const response = await getTaskData(config)
//             console.log("reB",response)
//             return response
//         }catch (error) {
//             throw error;
//           }
//     }
// );



import { createAsyncThunk } from "@reduxjs/toolkit";
import BasketService from "../../../services/TicketService/BasketService";
import {
  getTaskData,
  postTask,
  postTimerData,
  updateTask,
} from "../../../services/TicketService/TaskService";
import SubtaskService from "../../../services/TicketService/SubtaskService";
export const getBasketTaskData = createAsyncThunk(
  "getBasketTaskData",
  async (config, thunkapi) => {
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
      console.log("reB", response);
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
      console.log("reTM", response);
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
      console.log("reTM", response);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const updateBasketDetails = createAsyncThunk(
  "updateBasketDetails",
  async (config, thunkapi) => {
    console.log("c", config);
    try {
      const service = new BasketService();
      const response = service.updateBasket(config.id, config.payload);
      console.log("reTM", response);
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
        console.timeLog("data payload" , payload)
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
      console.log("reSub", response);
      return response;
    } catch (error) {
      throw error;
    }
  }
);
