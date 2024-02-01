import { createAsyncThunk } from "@reduxjs/toolkit";
import ManageMenuService from "../../services/MenuManagementService/ManageMenuService";
import DesignationService from "../../services/MastersService/DesignationService";

export const getRoles = createAsyncThunk(
  "getRoles",
  async (config, thunkapi) => {
    try {
      const roleId = sessionStorage.getItem("role_id");
      const service = new ManageMenuService();
      const response = await service.getRole(roleId);
      console.log("responserole", response);

      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const getDesignationData = createAsyncThunk(
  "getDesignationData",
  async (config, thunkapi) => {
    try {
      const service = new DesignationService();
      const response = await service.getDesignation();
      console.log("responserole", response);

      return response;
    } catch (error) {
      throw error;
    }
  }
);
