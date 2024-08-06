import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customAxios from '../../../../http/axios';
import { errorHandler } from '../../../../utils';

export const getPendingOrderListThunk = createAsyncThunk(
  'po/getPendingOrderList',
  async ({ categoryName, itemName, weightRange, sizeRange }) => {
    try {
      const response = await customAxios.get(
        `poRequisition/getPoReqOpenQtyData?item=${itemName}&category=${categoryName}${
          weightRange ? `&karagir_wt_range=${weightRange}` : ''
        }${sizeRange ? `&size_range=${sizeRange}` : ''}`
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

export const createPendingOrderThunk = createAsyncThunk(
  'po/createPendingOrder',
  async ({ formData, onSuccessHandler, onErrorHandler }) => {
    try {
      const response = await customAxios.post(
        `poRequisition/submitData`,
        formData
      );
      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          onSuccessHandler();
          toast.success(response?.data?.message);
          return response?.data?.message;
        } else if (response?.data?.status === 3) {
          errorHandler(response);
          if (response?.data?.data?.length) {
            return response.data;
          } else {
            onErrorHandler();
          }
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
  }
);

export const getUnixCodeAgainstVendorForErrorFileThunk = createAsyncThunk(
  'po/unixCodeAgainstVendorForErrorFile',
  async ({ venderName }) => {
    try {
      const response = await customAxios.get(
        `/poRequisition/getPOUploadDateTime/${venderName}`
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

export const getPendingOrderErrorFileThunk = createAsyncThunk(
  'po/pendingOrderErrorFile',
  async ({ unixCode }) => {
    try {
      const response = await customAxios.get(
        `/poRequisition/getPoErrorData/${unixCode}`
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
