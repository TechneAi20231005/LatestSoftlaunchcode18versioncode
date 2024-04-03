import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customAxios from '../../../../../http/axios';

export const getRemarkMasterListThunk = createAsyncThunk('remarkMaster/getRemarkList', async () => {
  try {
    const response = await customAxios.get(`/remarkMaster`);
    if (response?.status === 200 || response?.status === 201) {
      if (response?.data?.status === 1) {
        return { data: response?.data?.data, msg: response?.data?.message };
      } else {
        toast.error(response?.data?.message);
      }
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return Promise.reject(error?.response?.data?.message);
  }
});
export const addRemarkMasterThunk = createAsyncThunk(
  'remarkMaster/addRemark',
  async ({ formData, onSuccessHandler, onErrorHandler }) => {
    try {
      const response = await customAxios.post(`/remarkMaster`, formData);
      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          onSuccessHandler();
          toast.success(response?.data?.message);
          return response?.data?.message;
        } else {
          onErrorHandler();
          toast.error(response?.data?.message);
        }
      }
    } catch (error) {
      onErrorHandler();
      toast.error(error?.response?.data?.message);
      return Promise.reject(error?.response?.data?.message);
    }
  },
);

export const editRemarkMasterThunk = createAsyncThunk(
  'remarkMaster/editRemark',
  async ({ formData, onSuccessHandler, onErrorHandler, currentId }) => {
    try {
      const response = await customAxios.post(`/remarkMaster/${currentId}`, formData);
      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          onSuccessHandler();
          toast.success(response?.data?.message);
          return response?.data?.message;
        } else {
          onErrorHandler();
          toast.error(response?.data?.message);
        }
      }
    } catch (error) {
      onErrorHandler();
      toast.error(error?.response?.data?.message);
      return Promise.reject(error?.response?.data?.message);
    }
  },
);
