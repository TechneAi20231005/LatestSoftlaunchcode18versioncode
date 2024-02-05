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
export const postRole = createAsyncThunk(
  "postRole",
  async (config, thunkapi) => {
    try {
      const service = new RoleService();
      const response = await service.postRole(config);
      console.log("dd", response);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const updatedRole = createAsyncThunk(
  "updatedRole",
  async (config, thunkapi) => {
    console.log("c", config);
    try {
      const service = new RoleService();
      const response = await service.updateRole(config.id, config.payload);
      return response;
    } catch (error) {
      throw error;
    }
  }
);
