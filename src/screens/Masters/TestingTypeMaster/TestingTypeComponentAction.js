import { createAsyncThunk } from '@reduxjs/toolkit';
import TestingTypeServices from '../../../services/MastersService/TestingTypeService';

export const testingData = createAsyncThunk(
  'testingData',
  async (config, thunkapi) => {
    try {
      const service = new TestingTypeServices();
      const response = await service.getAlltestingType();
      return response;
    } catch (error) {
      throw error;
    }
  }
);
export const postTesting = createAsyncThunk(
  'postTesting',
  async (config, thunkapi) => {
    try {
      const service = new TestingTypeServices();
      const response = await service.postTestingType(config);

      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const updateTesting = createAsyncThunk(
  'updateTesting',
  async (config, thunkapi) => {
    try {
      const service = new TestingTypeServices();
      const response = await service.updateTestingType(
        config.id,
        config.payload
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
);
