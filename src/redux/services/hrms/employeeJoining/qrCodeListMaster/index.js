import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customAxios from '../../../../../http/axios';
import { errorHandler } from '../../../../../utils';

export const getQrCodeList = createAsyncThunk(
  'QRcode/getQrCodeListing',
  async () => {
    try {
      const response = await customAxios.get(`QRcode`);
      if (response?.status === 200 || response?.status === 201) {
        return { data: response?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }
    } catch (error) {
      console.log(error, 'error');
      errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  }
);
export const addQrCodeList = createAsyncThunk(
  'QRcode/addQrCodeListing',
  async ({ formData, onSuccessHandler, onErrorHandler }) => {
    try {
      const response = await customAxios.post(`QRcode/postData`, formData);
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

export const getQrCodeListById = createAsyncThunk(
  'QRcode/getQrCodeListById',
  async ({ currentId }) => {
    try {
      const response = await customAxios.get(`QRcode/${currentId}`);
      if (response?.status === 200 || response?.status === 201) {
        return { data: response?.data, msg: response?.data?.message };
      } else {
        errorHandler(response);
      }
    } catch (error) {
      console.log(error, 'error');
      errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  }
);
