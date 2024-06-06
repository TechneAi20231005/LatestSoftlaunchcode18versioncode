import { createAsyncThunk } from '@reduxjs/toolkit';

import customAxios from '../../../../../http/axios';
import { toast } from 'react-toastify';

import { errorHandler } from '../../../../../utils';

export const getUserTaskData = createAsyncThunk(
  'getUserTaskData',
  async ({ taskId }) => {
    try {
      const response = await customAxios.get(
        `/ticketTask/getTaskUser/${taskId}`
      );

      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          return { data: response?.data?.data, msg: response?.data?.message };
        } else {
          errorHandler(response);
        }
      }
    } catch (error) {
      errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  }
);

export const updateTaskPlannerData = createAsyncThunk(
  'updateTaskPlannerData',
  async ({ taskId, payload }) => {
    try {
      const response = await customAxios.post(
        `/ticketTask/updateTaskPlanner/${taskId}`,
        payload
      );

      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          toast.success(response?.data?.message);
          return { msg: response?.data?.message };
        } else {
          errorHandler(response);
        }
      }
    } catch (error) {
      errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  }
);
