import { createAsyncThunk } from "@reduxjs/toolkit";
import DepartmentService from "../../../services/MastersService/DepartmentService";
export const departmentData = createAsyncThunk(
  "departmentData",
  async (config, thunkapi) => {
    try {
      const service = new DepartmentService();
      const response = await service.getDepartment();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const postdepartment = createAsyncThunk(
  "postdepartment",
  async (config, thunkapi) => {
    try {
      const service = new DepartmentService();
      const response = await service.postDepartment(config);
      return response;
    } catch (error) {
      throw error;
    }
  }
);
export const updateDepartment = createAsyncThunk(
  "updateDepartment",
  async (config, thunkapi) => {
    try {
      const service = new DepartmentService();
      const response = await service.updateDepartment(config.id, config.payload);
      console.log("updateDepartment",response);
      return response;
    } catch (error) {
      throw error;
    }
  }
);