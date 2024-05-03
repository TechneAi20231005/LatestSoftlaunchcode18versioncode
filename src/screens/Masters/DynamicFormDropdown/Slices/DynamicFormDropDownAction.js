import { createAsyncThunk } from "@reduxjs/toolkit";
import DynamicFormDropdownMasterService from "../../../../services/MastersService/DynamicFormDropdownMasterService";
import DynamicFormService from "../../../../services/MastersService/DynamicFormService";


export const dynamicFormDropDownData = createAsyncThunk(
  "dynamicFormDropDownData",
  async (config, thunkapi) => {
    try {
      const service = new DynamicFormDropdownMasterService();
      const response = await service.getAllDynamicFormDropdown();

      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const dynamicFormData = createAsyncThunk(
    "dynamicFormData",
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

  export const getAllDropDownData = createAsyncThunk(
    "getAllDropDownData",
    async (config, thunkapi) => {
      try {
        const service = new DynamicFormDropdownMasterService();
        const response = await service.getAllDropdown();
  
        return response;
      } catch (error) {
        throw error;
      }
    }
  );
  


  
  

