import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customAxios from "../../../../http/axios";
import { errorHandler } from "../../../../utils";
import {
  _apiUrl,
  _attachmentUrl,
  attachmentUrl,
} from "../../../../settings/constants";

export const getProjectModuleMasterThunk = createAsyncThunk(
  "projectModuleMaster/getProjectModuleMasterList",
  async () => {
    try {
      const response = await customAxios.get(`projects/getAllProject`);
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

export const getModuleMasterThunk = createAsyncThunk(
  "ModuleMaster/getModuleMasterList",
  async () => {
    try {
      const response = await customAxios.get(`module/getAllModule`);
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

export const getSubModuleMasterThunk = createAsyncThunk(
  "subModuleMaster/getSubModuleMasterList",
  async () => {
    try {
      const response = await customAxios.get(`submodule/getAllSubmodule`);
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
export const downloadFormatFileThunk = createAsyncThunk(
  "downloadFormatFile",
  async (
    { project_id, module_id, submodule_id },
    { onSuccessHandler, onErrorHandler }
  ) => {
    try {
      const submoduleParam = JSON.stringify(submodule_id);

      const endpoint = `draftFile/getTestdraftBulkFormat?project_id=${project_id}&module_id=${module_id}&submodule_id=${encodeURIComponent(
        submoduleParam
      )}`;
      const response = await customAxios.get(endpoint);

      if (response?.status === 200 || response?.status === 201) {
        URL = `${_apiUrl}` + endpoint;

        window.open(URL, "_blank").focus();
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

export const importTestDraftThunk = createAsyncThunk(
  "testDraftMaster/importTestDraft",
  async ({ formData, onSuccessHandler, onErrorHandler }) => {
    try {
      const response = await customAxios.post(
        `testCases/addDraft/postTestdraftImportTestcases`,
        formData
      );
      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          onSuccessHandler();
          toast.success(response?.data?.message);
          return response?.data?.message;
        } else {
          onErrorHandler();
          URL = `${_attachmentUrl}` + response.data.data.error_file;

          window.open(URL, "_blank")?.focus();
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
