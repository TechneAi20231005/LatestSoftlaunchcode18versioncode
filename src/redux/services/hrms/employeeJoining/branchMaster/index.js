import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customAxios from '../../../../../http/axios';

export const getBranchMasterListThunk = createAsyncThunk('branchMaster/getBranchList', async () => {
  try {
    const response = await customAxios.get(`/locationMaster`);
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
export const addBranchMasterThunk = createAsyncThunk(
  'branchMaster/addBranch',
  async ({ formData, onSuccessHandler, onErrorHandler }) => {
    try {
      const response = await customAxios.post(`/locationMaster`, formData);
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

export const editBranchMasterThunk = createAsyncThunk(
  'branchMaster/editBranch',
  async ({ formData, onSuccessHandler, onErrorHandler, currentId }) => {
    try {
      const response = await customAxios.post(`/locationMaster/${currentId}`, formData);
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