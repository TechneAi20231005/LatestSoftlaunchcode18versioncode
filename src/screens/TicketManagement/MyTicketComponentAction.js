import { createAsyncThunk } from "@reduxjs/toolkit";
import StatusService from "../../services/MastersService/StatusService";
import MyTicketService from "../../services/TicketService/MyTicketService";
import UserService from "../../services/MastersService/UserService";

export const getStatusData = createAsyncThunk(
  "getStatusData",
  async (config, thunkapi) => {
    try {
      const service = new StatusService();
      const response = await service.getStatus();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const getUserTicketsTest = createAsyncThunk(
  "getUserTicketsTest",
  async (config, thunkapi) => {
    try {
      const service = new MyTicketService();
      const response = await service.getUserTicketsTest(config);
      console.log("respp",response)
      return response;
    } catch (error) {
      throw error;
    }
  }
);


export const getUserForMyTicketsData = createAsyncThunk("getUserForMyTicketsData",async(config,thunkapi)=>{
    try{
        const service=new UserService();
        const response = await service.getUserForMyTickets(config);
        console.log("respp",response)
        return response;

    }
    catch(error){
        throw error;
    }
})