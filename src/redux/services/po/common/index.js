import { createAsyncThunk } from '@reduxjs/toolkit';
import customAxios from '../../../../http/axios';
import { errorHandler } from '../../../../utils';

export const getVenderListThunk = createAsyncThunk(
  'po/getVendorList',
  async () => {
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
  }
);

export const getItemCategoryListThunk = createAsyncThunk(
  'po/getItemCategoryList',
  async () => {
    try {
      const response = await customAxios.get(
        `poRequisition/getItemCategoryList`
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

// delete requisition

export const deleteItemCategoryListThunk = createAsyncThunk(
  'po/deleteItemCategoryRecords',
  async (formData) => {
    try {
      const response = await customAxios.post(
        `poRequisition/deletePoReqRecords`,
        formData
      );
      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          return { data: response?.data, msg: response?.data?.message };
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

export const getDeleteRecordsThunk = createAsyncThunk(
  'po/getDeleteRecordsThunk',
  async ({ limit, page }) => {
    try {
      const response = await customAxios.get(
        `poRequisition/getDeletePoReqRecords?limit=${limit}&page=${page}`
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

//// export delete records

export const getExportDeleteRecordsThunk = createAsyncThunk(
  'po/getExportDeleteRecordsThunk',
  async () => {
    try {
      const response = await customAxios.get(
        `poRequisition/getDeletePoReqRecords?export=export`
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

export const getKaragirKnockOffWtSizeRangeFilterListThunk = createAsyncThunk(
  'po/getKaragirKnockOffWtSizeRangeList',
  async ({ categoryName, itemName, type }) => {
    try {
      const response = await customAxios.get(
        `poRequisition/getPoWeightSizeData?item=${itemName}&category=${encodeURIComponent(
          categoryName
        )}${type ? `&type=${type}` : ''}`
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

///new code added for po requisition
