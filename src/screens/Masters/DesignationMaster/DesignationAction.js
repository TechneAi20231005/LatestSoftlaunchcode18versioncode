import { createAsyncThunk } from '@reduxjs/toolkit';
import DesignationService from '../../../services/MastersService/DesignationService';

export const getDesignationDataListThunk = createAsyncThunk(
  'getDesignationDataListThunk',
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
export const postDesignationData = createAsyncThunk(
  'postDesignationData',
  async (config, thunkapi) => {
    try {
      const service = new DesignationService();
      const response = await service.postDesignation(config);

      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const updatedDesignationData = createAsyncThunk(
  'updatedDesignationData',
  async (config, thunkapi) => {
    try {
      const service = new DesignationService();
      const response = await service.updateDesignation(
        config.id,
        config.payload
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
);
