import { createAsyncThunk } from "@reduxjs/toolkit";
import RoleService from "../../../services/MastersService/RoleService";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";

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

//______________getAllMenu_____________________


export const getAllMenu = createAsyncThunk(
  "getAllMenu",
  async (config, thunkapi) => {
  
    try {
      const service = new ManageMenuService();
      const response = await service.getAllMenu();
      return response;
    } catch (error) {
      throw error;
    }
  }
);
//_____________POSTmenuManage________________

export const postMenuData = createAsyncThunk(
  "postMenuData",
  async (config, thunkapi) => {
    try {
      const service = new ManageMenuService();
      const response = await service.postData(config);
      console.log("dd", response);
      return response;
    } catch (error) {
      throw error;
    }
  }
);






