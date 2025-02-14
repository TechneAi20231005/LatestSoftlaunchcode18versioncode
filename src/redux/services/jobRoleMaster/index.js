import { createAsyncThunk, current } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customAxios from '../../../http/axios';
import { errorHandler } from '../../../utils';
import axios from 'axios';
import { REACT_APP_API_REWAMP_BASE_URL } from '../../../config/envConfig';
export const getJobRoleMasterListThunk = createAsyncThunk(
  'jobRoleMaster/getJobRoleMasterList',
  async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(
        `${REACT_APP_API_REWAMP_BASE_URL}jobMaster/getData?export=1`,
        config
      );

      if (response?.status === 200 || response?.status === 201) {
        // if ([200, 201].includes(response.status)) {
        console.log(response.data);
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

export const addJobRoleMasterThunk = createAsyncThunk(
  'jobRoleMaster/addJobRole',
  async ({ formData, onSuccessHandler, onErrorHandler }) => {
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    try {
      const response = await axios.post(
        `${REACT_APP_API_REWAMP_BASE_URL}jobMaster/postData`,
        formData,
        config
      );
      if (response?.status === 200 || response?.status === 201) {
        // if ([200, 201].includes(response.status)) {
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

export const editJobRoleMasterThunk = createAsyncThunk(
  'jobMaster/createJobRole',
  async ({ formData, onSuccessHandler, onErrorHandler, currentId }) => {
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    try {
      const response = await axios.post(
        `${REACT_APP_API_REWAMP_BASE_URL}jobMaster/postData/${currentId}`,
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
