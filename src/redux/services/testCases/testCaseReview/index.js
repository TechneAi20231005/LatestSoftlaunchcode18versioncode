import { createAsyncThunk } from '@reduxjs/toolkit';
import customAxios, { rewampAxios } from '../../../../http/axios';
import { errorHandler } from '../../../../utils';
import { toast } from 'react-toastify';

export const getTestCaseReviewListThunk = createAsyncThunk(
  'testCaseReview/getTestCaseReviewListThunk',
  async ({ ticketId, taskId, limit, page, filter_testcase_data, type }) => {
    try {
      const response = await rewampAxios.get(
        `testCases/getCount/getTestDraft`,
        {
          params: {
            ticket_id: ticketId,
            task_id: taskId,
            limit: limit,
            page: page,
            filter_testcase_data: JSON.stringify(filter_testcase_data),
            type: type
          }
        }
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

export const getByTestPlanIDListThunk = createAsyncThunk(
  'testPlanID/getByTestPlanIDListThunk',
  async ({ id, limit, page, filter_testcase_data }) => {
    try {
      const response = await rewampAxios.get(
        `testCases/getDraftTestCases/getTestCases/${id}`,
        {
          params: {
            // id: id,
            limit: limit,
            page: page,
            filter_testcase_data: JSON.stringify(filter_testcase_data)
          }
        }
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

// export test case review data

export const getExportByTestPlanIDListThunk = createAsyncThunk(
  'testPlanID/getExportByTestPlanIDListThunk',
  async ({ id, type }) => {
    try {
      const response = await rewampAxios.get(
        `testCases/getDraftTestCases/getTestCases/${id}?type=${type}`
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

export const approveRejectByReviewerMasterThunk = createAsyncThunk(
  'approveReject/approveRejectByReviewerMasterThunk',
  async ({ formData, onSuccessHandler, onErrorHandler, planID }) => {
    try {
      const response = await rewampAxios.post(
        `testCases/reviewerAdd/approveRejectByReviewer/${planID}`,
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
export const getReviewTestCasesData = createAsyncThunk(
  'getReviewTestCasesData',
  async ({ id, status, onSuccessHandler, onErrorHandler, errorHandler }) => {
    try {
      const response = await rewampAxios.get(
        `testCases/getDraftTestCases/getReviewTestCases/${id}/${status}`
      );
      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          onSuccessHandler(response?.data);
          toast.success(response?.data?.message);
          return { data: response?.data, msg: response?.data?.message };
        } else {
          toast.error(response?.data?.message);
          onErrorHandler();
          errorHandler(response);
        }
      }
    } catch (error) {
      errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  }
);
