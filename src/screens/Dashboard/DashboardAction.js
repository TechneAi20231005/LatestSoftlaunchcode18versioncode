import { createAsyncThunk } from "@reduxjs/toolkit";
import ManageMenuService from "../../services/MenuManagementService/ManageMenuService";


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
  
