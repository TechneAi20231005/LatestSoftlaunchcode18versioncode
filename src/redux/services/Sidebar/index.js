import { createAsyncThunk } from '@reduxjs/toolkit';

import { errorHandler } from '../../../utils';
import customAxios from '../../../http/axios';
import { _rewampApiUrl } from '../../../settings/constants';
import axios from 'axios';
import { toast } from 'react-toastify';

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
    const token = localStorage.getItem('jwt_token');

    try {
      const apiUrl =
        _rewampApiUrl +
        'getMenuByRoleId/' +
        (role_id || localStorage.getItem('role_id'));

      // Make the API call using axios
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          return { data: response?.data?.data, msg: response?.data?.message };
        } else {
          errorHandler(response);
        }
      } else {
        errorHandler(response);
      }
    } catch (error) {
      errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  }
);
