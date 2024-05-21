import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customAxios from '../../../../http/axios';
import { errorHandler } from '../../../../utils';

export const uploadFileGenerateRequisitionThunk = createAsyncThunk(
  'po/uploadFileGenerateRequisition',
  async ({ formData, onSuccessHandler, onErrorHandler }) => {
    try {
      const response = await customAxios.post(`poRequisition/uploadRequisition`, formData);
      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          onSuccessHandler();
          toast.success(response?.data?.message);
          return response?.data?.message;
        } else {
          errorHandler(response);
          onErrorHandler(response?.data?.data?.error_file);
        }
      }
    } catch (error) {
      errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  },
);

export const getGenerateRequisitionListThunk = createAsyncThunk(
  'po/getGenerateRequisitionList',
  async ({ limit, page, search, filterValue }) => {
    try {
      const response = await customAxios.get(
        `poRequisition/getPoReqOpenQtyDataFilter?limit=${limit}&page=${page}&knockoff_karagir=${
          filterValue?.knockoff_karagir ?? 0
        }${search ? `&search=${search}` : ''}${
          filterValue?.item?.length > 0 ? `&item=${filterValue?.item}` : ''
        }${filterValue?.category?.length > 0 ? `&category=${filterValue?.category}` : ''}${
          filterValue?.weight_range?.length > 0 ? `&weight_range=${filterValue?.weight_range}` : ''
        }${filterValue?.size_range?.length > 0 ? `&size_range=${filterValue?.size_range}` : ''}`,
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
