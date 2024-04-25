import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customAxios from '../../../../../http/axios';
import { errorHandler } from '../../../../../utils';

export const getInterviewProcessDataThunk = createAsyncThunk(
  'interviewProcess/getInterviewData',
  async ({ currentId }) => {
    try {
      const response = await customAxios.get(`interviewProcess/getData/${currentId}`);
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

export const updateInterviewProcessThunk = createAsyncThunk(
  'interviewProcess/updateInterview',
  async ({ formData, onSuccessHandler, currentId }) => {
    try {
      const response = await customAxios.post(
        `/remarkHistory/addHistoryData/${currentId}`,
        formData,
      );
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

export const scheduleRescheduleInterviewThunk = createAsyncThunk(
  'interviewProcess/scheduleRescheduleInterview',
  async ({ formData, onSuccessHandler }) => {
    try {
      const response = await customAxios.post(`/interviewProcess/create`, formData);
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

export const createInterviewJobOfferProcessThunk = createAsyncThunk(
  'interviewProcess/createJobOffer',
  async ({ formData, onSuccessHandler, currentId }) => {
    try {
      const response = await customAxios.post(`/jobOffer/createJobOfferNew/${currentId}`, formData);
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

export const getSalaryNegotiatingActivityDataThunk = createAsyncThunk(
  'interviewProcess/salaryNegotiatingActivity',
  async ({ currentId }) => {
    try {
      const response = await customAxios.get(`jobOffer/getHistoryData/${currentId}`);
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

export const getSalaryOfferedByHrAndSrHr = createAsyncThunk(
  'interviewProcess/getSalaryOfferedByHrAndSrHr',
  async ({ currentId }) => {
    try {
      const response = await customAxios.get(`jobOffer/getSalaryOfferById/${currentId}`);
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

export const manageOnBoardingProcessThunk = createAsyncThunk(
  'interviewProcess/manageOnBoardingProcess',
  async ({ formData, onSuccessHandler, currentId, reviseAndBackQuery }) => {
    try {
      const response = await customAxios.post(
        `/onBoardingProcess/onBoardingToJobOffer/${currentId}${
          reviseAndBackQuery ? `/${reviseAndBackQuery}` : ''
        }`,
        formData,
      );
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
