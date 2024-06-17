import { createAsyncThunk } from '@reduxjs/toolkit';
import customAxios from '../../../http/axios';
import { errorHandler } from '../../../utils';

export const getTicketByIdListThunk = createAsyncThunk(
  'getTicketByIdListThunk',
  async ({ ticketId }) => {
    try {
      const response = await customAxios.get(
        `/ticketMaster/getTicketById/${ticketId}`
      );

      if (response?.status === 200 || response.status === 201) {
        if (response?.data?.status === 1) {
          return { data: response?.data?.data, msg: response?.data?.message };
        } else {
          errorHandler(response);
        }
      }
    } catch (error) {
      return Promise.reject(error?.response?.data?.message);
    }
  }
);

export const getBasketByIdListThunk = createAsyncThunk(
  'getBasketByIdListThunk',
  async ({ id }) => {
    try {
      const response = await customAxios.get(`/ticketBasket/${id}`);

      if (response?.status === 200 || response.status === 201) {
        if (response?.data?.status === 1) {
          return { data: response?.data?.data, msg: response?.data?.message };
        } else {
          errorHandler(response);
        }
      }
    } catch (error) {
      return Promise.reject(error?.response?.data?.message);
    }
  }
);

export const getTaskBytTicketListThunk = createAsyncThunk(
  'getTaskBytTicketListThunk',
  async ({ ticketId }) => {
    try {
      const response = await customAxios.get(
        `/testCases/getTaskByTicket/${ticketId}`
      );

      if (response?.status === 200 || response.status === 201) {
        if (response?.data?.status === 1) {
          return { data: response?.data?.data, msg: response?.data?.message };
        } else {
          errorHandler(response);
        }
      }
    } catch (error) {
      return Promise.reject(error?.response?.data?.message);
    }
  }
);

export const getSettingByNameListThunk = createAsyncThunk(
  'getSettingByNameListThunk',
  async ({ module_name, submodule_name }) => {
    try {
      const response = await customAxios.get(
        `/moduleSetting/getSettingByName/${module_name}/${submodule_name}`
      );

      if (response?.status === 200 || response.status === 201) {
        if (response?.data?.status === 1) {
          return { data: response?.data?.data, msg: response?.data?.message };
        } else {
          errorHandler(response);
        }
      }
    } catch (error) {
      return Promise.reject(error?.response?.data?.message);
    }
  }
);

export const getSprintByTicketIdListThunk = createAsyncThunk(
  'getSprintByTicketIdListThunk',
  async ({ ticketId }) => {
    try {
      const response = await customAxios.get(
        `/sprintMaster/getSprint/${ticketId}`
      );

      if (response?.status === 200 || response.status === 201) {
        if (response?.data?.status === 1) {
          return { data: response?.data, msg: response?.data?.message };
        } else {
          errorHandler(response);
        }
      }
    } catch (error) {
      return Promise.reject(error?.response?.data?.message);
    }
  }
);
