import { createAsyncThunk } from "@reduxjs/toolkit";
import ManageMenuService from "../../services/MenuManagementService/ManageMenuService";
import DesignationService from "../../services/MastersService/DesignationService";
import DynamicFormService from "../../services/MastersService/DynamicFormService";
import CustomerService from "../../services/MastersService/CustomerService";

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

export const getDynamiucFormData = createAsyncThunk(
  "getDynamiucFormData",
  async (config, thunkapi) => {
    try {
      const service = new DynamicFormService();
      const response = await service.getDynamicForm();
      console.log("responserole", response);

      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const getCustomerData = createAsyncThunk(
  "getCustomerData",
  async (config, thunkapi) => {
    try {
      const service = new CustomerService();
      const response = await service.getCustomer();
      console.log("responserole", response);

      return response;
    } catch (error) {
      throw error;
    }
  }
);
