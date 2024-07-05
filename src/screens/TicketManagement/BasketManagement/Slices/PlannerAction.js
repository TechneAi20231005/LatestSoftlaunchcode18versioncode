import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getTaskPlanner,
  updateTaskPlanner
} from '../../../../services/TicketService/TaskService';

export const UpdatePlannerData = createAsyncThunk(
  'UpdatePlannerData',
  async (config, thunkapi) => {
    try {
      const response = await updateTaskPlanner(config.taskId, config.payload);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const getTaskPlannerData = createAsyncThunk(
  'getTaskPlannerData',
  async (config, thunkapi) => {
    try {
      const response = await getTaskPlanner(config);
      return response;
    } catch (error) {
      throw error;
    }
  }
);
