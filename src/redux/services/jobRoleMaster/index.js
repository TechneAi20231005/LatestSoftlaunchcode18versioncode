import { createAsyncThunk, current } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customAxios from '../../../http/axios';
import { errorHandler } from '../../../utils';

export const getJobRoleMasterListThunk = createAsyncThunk(
  'jobRoleMaster/getJobRoleMasterList',
  async () => {
    try {
      const response = await customAxios.get(`jobMaster/getData?export=1`);

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
    try {
      const response = await customAxios.post(
        `/jobMaster/createJobRole`,
        formData
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
    try {
      const response = await customAxios.post(
        `/jobMaster/createJobRole/${currentId}`,
        formData
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
