import { createAsyncThunk } from "@reduxjs/toolkit";
import RoleService from "../../../services/MastersService/RoleService";

export const getRoleData = createAsyncThunk(
  "getRoleData",
  async (config, thunkapi) => {
    try {
      const service = new RoleService();
      const response = await service.getRole();

      return response;
    } catch (error) {
      throw error;
    }
  }
);
