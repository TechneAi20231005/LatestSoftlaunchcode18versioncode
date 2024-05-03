import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customAxios from '../../../../../http/axios';
import { errorHandler } from '../../../../../utils';

export const getInterviewMasterListThunk = createAsyncThunk(
  'interviewMaster/getInterviewList',
  async () => {
    try {
      const response = await customAxios.get(`interviewMaster/0`);
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
export const addInterviewMasterThunk = createAsyncThunk(
  'interviewMaster/addInterview',
  async ({ formData, onSuccessHandler, onErrorHandler }) => {
    try {
      const response = await customAxios.post(`interviewMaster`, formData);
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
  },
);

export const editInterviewMasterThunk = createAsyncThunk(
  'interviewMaster/editInterview',
  async ({ formData, onSuccessHandler, onErrorHandler, currentId }) => {
    try {
      const response = await customAxios.post(`interviewMaster/${currentId}`, formData);
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
  },
);
