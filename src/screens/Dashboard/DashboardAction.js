import { createAsyncThunk } from "@reduxjs/toolkit";
import CityService from "../../services/MastersService/CityService";
import CountryService from "../../services/MastersService/CountryService";
import StateService from "../../services/MastersService/StateService";
import UserService from "../../services/MastersService/UserService";
import { getNotification } from "../../services/NotificationService/NotificationService";
import { getData } from "../../services/DashboardService";
import ManageMenuService from "../../services/MenuManagementService/ManageMenuService";
import DesignationService from "../../services/MastersService/DesignationService";
import DynamicFormService from "../../services/MastersService/DynamicFormService";
import CustomerService from "../../services/MastersService/CustomerService";
import RoleService from "../../services/MastersService/RoleService";
import CustomerTypeService from "../../services/MastersService/CustomerTypeService";
import { errorHandler } from "../../utils";

export const getCityData = createAsyncThunk(
  "getCityData",
  async (config, thunkapi) => {
    try {
      const service = new CityService();
      const response = await service.getCity();

      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
      throw error;
    }
  }
);

export const postCityData = createAsyncThunk(
  "postCityData",
  async (config, thunkapi) => {
    try {
      const service = new CityService();
      const response = await service.postCity(config);
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
      throw error;
    }
  }
);

export const updateCityData = createAsyncThunk(
  "updateCityData",
  async (config, thunkapi) => {
    try {
      const service = new CityService();
      const response = await service.updateCity(config.id, config.payload);
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
      throw error;
    }
  }
);

export const getCountryData = createAsyncThunk(
  "getCountryData",
  async (config, thunkapi) => {
    try {
      const service = new CountryService();
      const response = await service.getCountry();
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);

      throw error;
    }
  }
);

export const getCountryDataSort = createAsyncThunk(
  "getCountryDataSort",
  async (config, thunkapi) => {
    try {
      const service = new CountryService();
      const response = await service.getCountrySort();
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
      throw error;
    }
  }
);

export const postCountryData = createAsyncThunk(
  "postCountryData",
  async (config, thunkapi) => {
    try {
      const service = new CountryService();
      const response = await service.postCountry(config);
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
      throw error;
    }
  }
);

export const updateCountryData = createAsyncThunk(
  "updateCountryData",
  async (config, thunkapi) => {
    try {
      const service = new CountryService();
      const response = await service.updateCountry(config.id, config.payload);
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }
      return response;
    } catch (error) {
      errorHandler(error?.response);
      throw error;
    }
  }
);

export const getStateData = createAsyncThunk(
  "getStateData",
  async (config, thunkapi) => {
    try {
      const service = new StateService();
      const response = await service.getState();
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
      throw error;
    }
  }
);

export const postStateData = createAsyncThunk(
  "postStateData",
  async (config, thunkapi) => {
    try {
      const service = new StateService();
      const response = await service.postState(config);
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
      throw error;
    }
  }
);

export const updateStateData = createAsyncThunk(
  "updateStateData",
  async (config, thunkapi) => {
    try {
      const service = new StateService();
      const response = await service.updateState(config.id, config.payload);
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
      throw error;
    }
  }
);

export const getStateDataSort = createAsyncThunk(
  "getStateDataSort",
  async (config, thunkapi) => {
    try {
      const service = new StateService();
      const response = await service.getStateSort();
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
      throw error;
    }
  }
);

export const getEmployeeData = createAsyncThunk(
  "getEmployeeData",
  async (config, thunkapi) => {
    try {
      const service = new UserService();
      const response = await service.getUser();
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
      throw error;
    }
  }
);

export const getEmployeeDataById = createAsyncThunk(
  "getEmployeeDataById",
  async (id, thunkapi) => {
    try {
      const service = new UserService();
      const response = await service.getUsers(id);
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
      throw error;
    }
  }
);

export const postUserData = createAsyncThunk(
  "postUserData",
  async (config, thunkapi) => {
    try {
      const service = new UserService();
      const response = await service.postUser(config);
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
      throw error;
    }
  }
);

export const updateUserData = createAsyncThunk(
  "updateUserData",
  async (config, thunkapi) => {
    try {
      const service = new UserService();
      const response = await service.updateUser(config.id, config.payload);
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
      throw error;
    }
  }
);

export const getNotifications = createAsyncThunk(
  "getNotifications",
  async (config, thunkapi) => {
    try {
      const response = await getNotification();
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
      throw error;
    }
  }
);

export const getAllDashboardData = createAsyncThunk(
  "getAllDashboardData",
  async (config, thunkapi) => {
    try {
      const response = await getData();
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }
      return response;
    } catch (error) {
      errorHandler(error?.response);
      throw error;
    }
  }
);

export const getRoles = createAsyncThunk(
  "getRoles",
  async (config, thunkapi) => {
    try {
      const roleId = sessionStorage.getItem("role_id");
      const service = new ManageMenuService();
      const response = await service.getRole(roleId);
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
      throw error;
    }
  }
);

export const getAllRoles = createAsyncThunk(
  "getAllRoles",
  async (config, thunkapi) => {
    try {
      const roleId = sessionStorage.getItem("role_id");
      const service = new RoleService();
      const response = await service.getRole(roleId);
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
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
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
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
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
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
      if (response?.data?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }

      return response;
    } catch (error) {
      errorHandler(error?.response);
      throw error;
    }
  }
);

export const getCustomerType = createAsyncThunk(
  "getCustomerType",
  async (config, thunkapi) => {
    try {
      const service = new CustomerTypeService();
      const response = await service.getCustomerType();

      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const postCustomerData = createAsyncThunk(
  "postCustomerData",
  async (config, thunkapi) => {
    try {
      const service = new CustomerService();
      const response = await service.postCustomer(config);

      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const getCustomerByIdData = createAsyncThunk(
  "getCustomerByIdData",
  async (config, thunkapi) => {
    try {
      const service = new CustomerService();
      const response = await service.getCustomerById(config);

      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const updateCustomerData = createAsyncThunk(
  "updateCustomerData",
  async (config, thunkapi) => {
    try {
      const service = new CustomerService();
      const response = await service.updateCustomer(config.id, config.payload);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const getAllUserById = createAsyncThunk(
  "getAllUserById",
  async (config, thunkapi) => {
    try {
      const service = new UserService();
      const response = await service.getUserById(config);

      return response;
    } catch (error) {
      throw error;
    }
  }
);
