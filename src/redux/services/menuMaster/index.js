import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { REACT_REVAMP_URL } from '../../../config/envConfig';
import { errorHandler } from '../../../utils';
import axios from 'axios';

export const getMenuMasterList = createAsyncThunk(
  'menuMaster/getData',
  async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(
        `http://103.97.105.81:89/TicketingDev/public/api/menuMaster/getData?export=1`,
        config
      );
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
export const addMenuMasterList = createAsyncThunk(
  'menuMaster/addMenuMasterListing',
  async ({ formData, onSuccessHandler, onErrorHandler }) => {
    try {
      const token = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.post(
        `http://103.97.105.81:89/TicketingDev/public/api/menuMaster/postData`,
        formData,
        config
      );
      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          onSuccessHandler();
          toast.success(response?.data?.message);
          return response?.data?.data;
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

export const editMenuMasterList = createAsyncThunk(
  'menuMaster/editMenuMaster',
  async ({ formData, onSuccessHandler, onErrorHandler, currentId }) => {
    try {
      const token = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.post(
        `http://103.97.105.81:89/TicketingDev/public/api/menuMaster/postData/${currentId}`,
        formData,
        config
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

export const getMenuMasterListById = createAsyncThunk(
  'MenuMaster/getMenuMasterListById',
  async ({ currentId }) => {
    try {
      const response = await axios.get(
        `http://103.97.105.81:89/TicketingDev/public/api/menuMaster/getData/${currentId}`
      );
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
