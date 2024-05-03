import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customAxios from '../../../../../http/axios';
import { errorHandler } from '../../../../../utils';

export const getFollowUpListThunk = createAsyncThunk(
  'followUp/getFollowUpList',
  async ({ currentId }) => {
    try {
      const response = await customAxios.get(`followUp/${currentId}`);
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
  },
);
export const addFollowUpThunk = createAsyncThunk(
  'followUp/addFollowUp',
  async ({ formData, onSuccessHandler, currentId }) => {
    try {
      const response = await customAxios.post(`followUp/addFollowUp/${currentId}`, formData);
      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          onSuccessHandler();
          toast.success(response?.data?.message);
          return response?.data?.message;
        } else {
          errorHandler(response);
        }
      }
    } catch (error) {
      errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  },
);
