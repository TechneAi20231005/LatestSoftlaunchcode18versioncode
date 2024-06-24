import { createAsyncThunk } from '@reduxjs/toolkit';

import { errorHandler } from '../../../utils';
import customAxios from '../../../http/axios';

export const getEmployeeListThunk = createAsyncThunk(
  'employeeMaster',
  async ({ user_id }) => {
    try {
      const response = await customAxios.get(`/employeeMaster/${user_id}`);

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

export const getMenuListThunk = createAsyncThunk(
  'menuList',
  async ({ role_id }) => {
    try {
      const response = await customAxios.get(`/getMenuByRoleId/${role_id}`);

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
