import { createAsyncThunk } from '@reduxjs/toolkit';
import customAxios from '../../../../http/axios';
import { errorHandler } from '../../../../utils';
import { toast } from 'react-toastify';

export const getTestCaseReviewListThunk = createAsyncThunk(
  'testCaseReview/getTestCaseReviewListThunk',
  async () => {
    try {
      const response = await customAxios.get(`testCases/getCount/getTestDraft`);
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

export const getByTestPlanIDListThunk = createAsyncThunk(
  'testPlanID/getByTestPlanIDListThunk',
  async ({ id, limit, page }) => {
    try {
      const response = await customAxios.get(
        `testCases/getTestCase/reviewerTestCases/${id}?limit=${limit}&page=${page}`
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

export const approveRejectByReviewerMasterThunk = createAsyncThunk(
  'approveReject/approveRejectByReviewerMasterThunk',
  async ({ formData, onSuccessHandler, onErrorHandler }) => {
    try {
      const response = await customAxios.post(
        `testCases/reviewerAdd/approveRejectByReviewer`,
        formData
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
