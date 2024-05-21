import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customAxios from "../../../../http/axios";
import { errorHandler } from "../../../../utils";

export const getTestingTypeMasterListThunk = createAsyncThunk(
  "testingTypeMaster/getTestingTypeMasterList",
  async () => {
    try {
      const response = await customAxios.get(
        `testCases/testingType/getTestingType`
      );
      console.log("response", response);
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

export const addTestingTypeMasterThunk = createAsyncThunk(
  "testingTypeMaster/addTestingType",
  async ({ formData, onSuccessHandler, onErrorHandler }) => {
    try {
      const response = await customAxios.post(
        `testCases/testingType/addTestingType`,
        formData
      );
      console.log("responseT", response);
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

export const editTestingTypeMasterThunk = createAsyncThunk(
  "testingTypeMaster/editTestingType",
  async ({ formData, onSuccessHandler, onErrorHandler, currentId }) => {
    try {
      const response = await customAxios.post(
        `testCases/testingType/addTestingType/${currentId}`,
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
