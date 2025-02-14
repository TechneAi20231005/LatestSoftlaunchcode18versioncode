import { createAsyncThunk } from '@reduxjs/toolkit';
import customAxios from '../../../../http/axios';
import { errorHandler } from '../../../../utils';

export const getRequisitionHistoryThunk = createAsyncThunk(
  'po/getRequisitionHistoryList',
  async ({ filterData }) => {
    try {
      const response = await customAxios.post(`poRequisition/getPoRequisitionData`, filterData);
      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          return {
            data: response?.data,
            msg: response?.data?.message,
            isExport: filterData?.datatype ? true : false,
          };
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
