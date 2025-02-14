import { createAsyncThunk } from '@reduxjs/toolkit';
import ModuleService from '../../../services/ProjectManagementService/ModuleService';

export const moduleMaster = createAsyncThunk(
  'moduleMaster',
  async (config, thunkapi) => {
    try {
      const service = new ModuleService();
      const response = await service.getModule();

      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const getmoduleById = createAsyncThunk(
  'getmoduleById',
  async (config, thunkapi) => {
    try {
      const service = new ModuleService();
      const response = await service.getModuleById(config.id);

      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const postmoduleMaster = createAsyncThunk(
  'postmoduleMaster',
  async (config, thunkapi) => {
    try {
      const service = new ModuleService();
      const response = await service.postModule(config);

      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const updateModuleMaster = createAsyncThunk(
  'updateModuleMaster',
  async (config, thunkapi) => {
    try {
      const service = new ModuleService();
      const response = await service.updateModule(config.id, config.payload);

      return response;
    } catch (error) {
      throw error;
    }
  }
);
