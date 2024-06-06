import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import customAxios from '../../../http/axios';
import { errorHandler } from '../../../utils';

export const getSubTaskListThunk = createAsyncThunk(
  'getSubTaskListThunk',
  async ({ taskId }) => {
    try {
      const response = await customAxios.get(`ticketSubtask/${taskId}`);

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

export const addSubTaskModuleThunk = createAsyncThunk(
  'addSubTaskModuleThunk',
  async ({ formData, onSuccessHandler, onErrorHandler }) => {
    try {
      const response = await customAxios.post(`ticketSubtask`, formData);

      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          toast.success(response?.data?.message);
          onSuccessHandler();

          return response?.data?.message;
        } else {
          errorHandler(response);
          onErrorHandler();
        }
      }
    } catch (error) {
      onErrorHandler();
      errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  }
);

export const deleteSubTaskModuleThunk = createAsyncThunk(
  'deleteSubTaskModuleThunk',
  async ({ subtaskId, onSuccessHandler, onErrorHandler }) => {
    try {
      const response = await customAxios.post(
        `ticketSubtask/deleteSubtask/${subtaskId}`
      );

      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          toast.success(response?.data?.message);
          onSuccessHandler();

          return response?.data?.message;
        } else {
          errorHandler(response);
          onErrorHandler();
        }
      }
    } catch (error) {
      onErrorHandler();
      errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  }
);

export const completedTaskListThunk = createAsyncThunk(
  'completedTaskListThunk',
  async ({ subtaskId, formData }) => {
    try {
      const response = await customAxios.post(
        `ticketSubtask/completeSubtask/${subtaskId}`,
        formData
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
