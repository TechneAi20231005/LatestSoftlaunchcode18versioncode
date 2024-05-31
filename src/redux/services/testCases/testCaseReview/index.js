import { createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../../../http/axios";
import { errorHandler } from "../../../../utils";

export const getTestCaseReviewListThunk = createAsyncThunk(
  "testCaseReview/getTestCaseReviewListThunk",
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
  "testPlanID/getByTestPlanIDListThunk",
  async ({ test_plan_id }) => {
    try {
      const response = await customAxios.get(
        `testCases/getTestCase/reviewerTestCases/${test_plan_id}`
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
