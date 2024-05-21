import { createAsyncThunk } from '@reduxjs/toolkit';
import customAxios from '../../../../http/axios';
import { errorHandler } from '../../../../utils';

export const getVenderListThunk = createAsyncThunk('po/getVendorList', async () => {
  try {
    const response = await customAxios.get(`poRequisition/getVendorList`);
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
});

export const getItemCategoryListThunk = createAsyncThunk('po/getItemCategoryList', async () => {
  try {
    const response = await customAxios.get(`poRequisition/getItemCategoryList`);
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
});

export const getKnockoffWtRangeListThunk = createAsyncThunk(
  'po/getKnockoffWtRangeList',
  async ({ categoryName, itemName, type }) => {
    try {
      const response = await customAxios.get(
        `poRequisition/getPoWeightSizeData${categoryName ? `/${categoryName}` : ''}${
          itemName ? `/${itemName}` : ''
        }${type ? `?type=${type}` : ''}`,
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

export const getSizeRangeListThunk = createAsyncThunk(
  'po/getSizeRangeList',
  async ({ categoryName, itemName, weightRange }) => {
    try {
      const response = await customAxios.get(
        `poRequisition/getPoWeightSizeData/${categoryName}/${itemName}/${weightRange}`,
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
