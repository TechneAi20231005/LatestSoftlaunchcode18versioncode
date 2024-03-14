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

export const getCityData = createAsyncThunk("getCityData", async (config, thunkapi) => {
  try {
    const service = new CityService();
    const response = await service.getCity()
    return (response)
  } catch (error) {
    throw (error)
  }
})



export const postCityData = createAsyncThunk("postCityData", async (config, thunkapi) => {
  try {
    const service = new CityService();
    const response = await service.postCity(config)
    return (response)
  } catch (error) {
    throw (error)
  }
})


export const updateCityData = createAsyncThunk("updateCityData", async (config, thunkapi) => {
  try {
    const service = new CityService();
    const response = await service.updateCity(config.id, config.payload)
    return (response)
  } catch (error) {
    throw (error)
  }
})


export const getCountryData = createAsyncThunk("getCountryData", async (config, thunkapi) => {
  try {
    const service = new CountryService();
    const response = await service.getCountry()

    return (response)
  } catch (error) {
    throw (error)
  }
})


export const getCountryDataSort = createAsyncThunk("getCountryDataSort", async (config, thunkapi) => {
  try {
    const service = new CountryService();
    const response = await service.getCountrySort()
    return (response)
  } catch (error) {
    throw (error)
  }
})



export const postCountryData = createAsyncThunk("postCountryData", async (config, thunkapi) => {
  try {
    const service = new CountryService();
    const response = await service.postCountry(config)

    return (response)
  } catch (error) {
    throw (error)
  }
})


export const updateCountryData = createAsyncThunk("updateCountryData", async (config, thunkapi) => {
  try {
    const service = new CountryService();
    const response = await service.updateCountry(config.id, config.payload)
    return (response)
  } catch (error) {
    throw (error)
  }
})

export const getStateData = createAsyncThunk("getStateData", async (config, thunkapi) => {
  try {
    const service = new StateService();
    const response = await service.getState()

    return (response)
  } catch (error) {
    throw (error)
  }
})


export const postStateData = createAsyncThunk("postStateData", async (config, thunkapi) => {
  try {
    const service = new StateService();
    const response = await service.postState(config)

    return (response)
  } catch (error) {
    throw (error)
  }
})


export const updateStateData = createAsyncThunk("updateStateData", async (config, thunkapi) => {
  try {
    const service = new StateService();
    const response = await service.updateState(config.id, config.payload)

    return (response)
  } catch (error) {
    throw (error)
  }
})


export const getStateDataSort = createAsyncThunk("getStateDataSort", async (config, thunkapi) => {
  try {
    const service = new StateService();
    const response = await service.getStateSort()

    return (response)
  } catch (error) {
    throw (error)
  }
})

export const getEmployeeData = createAsyncThunk("getEmployeeData", async (config, thunkapi) => {
  try {
    const service = new UserService();
    const response = await service.getUser()

    return (response)
  } catch (error) {
    throw (error)
  }
})


export const getEmployeeDataById = createAsyncThunk("getEmployeeDataById", async (id, thunkapi) => {
  try {
    const service = new UserService();
    const response = await service.getUsers(id)

    return (response)
  } catch (error) {
    throw (error)
  }
})



export const postUserData = createAsyncThunk("postUserData", async (config, thunkapi) => {
  try {
    const service = new UserService();
    const response = await service.postUser(config)

    return (response)
  } catch (error) {
    throw (error)
  }
})

export const updateUserData = createAsyncThunk("updateUserData", async (config, thunkapi) => {
  try {
    const service = new UserService();
    const response = await service.updateUser(config.id, config.payload)

    return (response)
  } catch (error) {
    throw (error)
  }
})


export const getNotifications = createAsyncThunk("getNotifications", async (config, thunkapi) => {
  try {
    const response = await getNotification()
    return (response)

  } catch (error) {
    throw (error)
  }
})


export const getAllDashboardData = createAsyncThunk("getAllDashboardData", async (config, thunkapi) => {
  try {
    const response = await getData()
    return (response)

  } catch (error) {
    throw (error)
  }
})

export const getRoles = createAsyncThunk(
  "getRoles",
  async (config, thunkapi) => {
    try {
      const roleId = sessionStorage.getItem("role_id");
      const service = new ManageMenuService();
      const response = await service.getRole(roleId);

      return response;
    } catch (error) {
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

      return response;
    } catch (error) {
      throw error;
    }
  })


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
  })


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
  })

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
  })

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
  })


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
  })


