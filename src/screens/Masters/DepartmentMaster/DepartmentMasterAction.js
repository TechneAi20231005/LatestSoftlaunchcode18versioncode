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
