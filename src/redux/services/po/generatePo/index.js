import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customAxios from '../../../../http/axios';
import { errorHandler } from '../../../../utils';

export const getPendingOrderListThunk = createAsyncThunk(
  'po/getPendingOrderList',
  async ({ categoryName, itemName, weightRange, sizeRange }) => {
    try {
      const response = await customAxios.get(
        `poRequisition/getPoReqOpenQtyData/${categoryName}/${itemName}${
          weightRange ? `/${weightRange}` : ''
        }${sizeRange ? `/${sizeRange}` : ''}`,
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
  },
);

export const createPendingOrderThunk = createAsyncThunk(
  'po/createPendingOrder',
  async ({ formData, onSuccessHandler }) => {
    try {
      const response = await customAxios.post(`poRequisition/submitData`, formData);
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

export const poBulkUploadFileExportBeCheckThunk = createAsyncThunk(
  'po/poBulkUploadFileExportBeCheck',
  async ({ onSuccessHandler }) => {
    try {
      const response = await customAxios.post(`poRequisition/exportData`);
      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          toast.success(response?.data?.message);
          onSuccessHandler();
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
