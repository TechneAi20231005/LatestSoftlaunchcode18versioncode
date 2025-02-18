import { createAsyncThunk } from '@reduxjs/toolkit';

import TenantService from '../../services/MastersService/TenantService';
import { errorHandler } from '../../utils';

export const getAllTenant = createAsyncThunk(
  'getAllTenant',
  async (config, thunkapi) => {
    try {
      const service = new TenantService();
      const response = await service.getTenant();

      return response;
    } catch (error) {
      errorHandler(error);
    }
  }
);
export const posttenantData = createAsyncThunk(
  'posttenantData',
  async (config, thunkapi) => {
    try {
      const service = new TenantService();
      const response = await service.postTenant(config);

      return response;
    } catch (error) {
      errorHandler(error);
    }
  }
);

export const updatetenantData = createAsyncThunk(
  'updatedRole',
  async (config, thunkapi) => {
    try {
      const service = new TenantService();
      const response = await service.updateTenant(config.id, config.payload);
      return response;
    } catch (error) {
      errorHandler(error);
    }
  }
);
