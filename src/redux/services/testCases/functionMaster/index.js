import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customAxios from '../../../../http/axios';
import { errorHandler } from '../../../../utils';
import axios from 'axios';
import { REACT_APP_API_REWAMP_BASE_URL } from '../../../../config/envConfig';

export const getFunctionMasterListThunk = createAsyncThunk(
  'functionMaster/getFunctionMasterList',
  async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(
        `${REACT_APP_API_REWAMP_BASE_URL}testCases/getFunctionDetails`,
        config
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

export const addFunctionMasterThunk = createAsyncThunk(
  'functionMaster/addFunction',
  async ({ formData, onSuccessHandler, onErrorHandler }) => {
    try {
      const token = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.post(
        `${REACT_APP_API_REWAMP_BASE_URL}testCases/addFunction`,
        formData,
        config
      );

      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          onSuccessHandler();
          toast.success(response?.data?.message);
          return response?.data?.message;
        } else {
          onErrorHandler();
          errorHandler(response);
        }
      }
    } catch (error) {
      onErrorHandler();
      errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  }
);

export const editFunctionMasterThunk = createAsyncThunk(
  'functionMaster/editfunction',
  async ({ formData, onSuccessHandler, onErrorHandler, currentId }) => {
    try {
      const token = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.post(
        `${REACT_APP_API_REWAMP_BASE_URL}testCases/addFunction/${currentId}`,
        formData,
        config
      );
      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          onSuccessHandler();
          toast.success(response?.data?.message);
          return response?.data?.message;
        } else {
          onErrorHandler();
          errorHandler(response);
        }
      }
    } catch (error) {
      onErrorHandler();
      errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  }
);
