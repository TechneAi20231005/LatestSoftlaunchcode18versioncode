import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customAxios, { rewampAxios } from '../../../../http/axios';
import { errorHandler } from '../../../../utils';
// import axios from 'axios';
// import { REACT_APP_API_REWAMP_BASE_URL } from '../../../../config/envConfig';

export const getTestingGroupMasterListThunk = createAsyncThunk(
  'testingGroupMaster/getTestingGroupMasterList',
  async () => {
    try {
      const response = await rewampAxios.get(`testCases/getGroupTypeDetails`);
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

export const addTestingGroupMasterThunk = createAsyncThunk(
  'testingGroupMaster/addTestingGroup',
  async ({ formData, onSuccessHandler, onErrorHandler }) => {
    try {
      const response = await rewampAxios.post(
        `testCases/addGroupType`,
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

export const editTestingGroupMasterThunk = createAsyncThunk(
  'testingGroupMaster/editTestingGroup',
  async ({ formData, onSuccessHandler, onErrorHandler, currentId }) => {
    try {
      const response = await rewampAxios.post(
        `testCases/addGroupType/${currentId}`,
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
