import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getTaskUser,
  updateTaskPlanner
} from '../../../../services/TicketService/TaskService';

export const getUserTaskData = createAsyncThunk(
  'getUserTaskData',
  async (config, thunkapi) => {
    try {
      const response = await getTaskUser(config);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const updateTaskPlannerData = createAsyncThunk(
  'updateTaskPlannerData',
  async (config, thunkapi) => {
    try {
      const response = await updateTaskPlanner(config.taskId, config.payload);
      return response;
    } catch (error) {
      throw error;
    }
  }
);
