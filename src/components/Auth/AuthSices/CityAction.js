import { createAsyncThunk } from "@reduxjs/toolkit";
import CityService from "../../../services/MastersService/CityService";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";


const cityService = new CityService();
const manageMenuService=new ManageMenuService()
export const postCityComponent = createAsyncThunk("postCityComponet",async (payload, thunkapi) => {
    try {
      const res = await cityService.postCity(payload);
      if (res?.status === 200 && res?.data?.status === 1) {
        const data = res?.data;
        console.log(data);

        return data;
      } else {
        return res.message;
      }
    } catch (error) {
      throw error;
    }
  }
);

export const getCity = createAsyncThunk( "getCityComponet",
  async (payload, thunkapi) => {
    try {
      const res = await cityService.getCity();
      const data = res?.data;
      return data;
    } catch (error) {
      throw error;
    }
  }
);

export const getRole = createAsyncThunk(
  "getRoleComponet",
  async (payload, thunkapi) => {
    try {
      const res = await manageMenuService.getRole();
      const data = res.data;
      console.log("data",data)
      return data;
    } catch (error) {
      throw error;
    }
  }
);
