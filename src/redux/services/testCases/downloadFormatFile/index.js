import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customAxios from '../../../../http/axios';
import { errorHandler } from '../../../../utils';
import { _apiUrl, _attachmentUrl } from '../../../../settings/constants';

export const getProjectModuleMasterThunk = createAsyncThunk(
  'projectModuleMaster/getProjectModuleMasterList',
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
  'ModuleMaster/getModuleMasterList',
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
  'subModuleMaster/getSubModuleMasterList',
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
  'downloadFormatFile',
  async ({ project_id, module_id, submodule_id, onSuccessHandler }) => {
    try {
      const submoduleQueryParam = submodule_id
        .map((id) => `submodule_id[]=${id}`)
        .join('&');

      const endpoint = `draftFile/getTestdraftBulkFormat?project_id=${project_id}&module_id=${module_id}&${submoduleQueryParam}`;
      const response = await customAxios.get(endpoint);
      if (response?.status === 200 || response?.status === 201) {
        window.open(`${_apiUrl}${endpoint}`, '_parent').focus();
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
  }
);

////get draft test case  data
export const getDraftTestCaseList = createAsyncThunk(
  'draftTestCase/getDraftTestCaseList',
  async ({ limit, page, filter_testcase_data }) => {
    try {
      const response = await customAxios.get(
        `testCases/getDraftTestCases/getTestCases`,
        {
          params: {
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

//// get all test case data

export const getAllDraftTestCaseList = createAsyncThunk(
  'draftTestCase/getAllDraftTestCaseList',
  async ({ type }) => {
    try {
      const response = await customAxios.get(
        `testCases/getDraftTestCases/getTestCases?type=${type}`
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
export const importTestDraftThunk = createAsyncThunk(
  'testDraftMaster/importTestDraft',
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
          return { data: response?.data.data, msg: response?.data?.message };
        } else {
          onErrorHandler();
          const url = `${_attachmentUrl}` + response.data.data.error_file;

          window.open(url, '_blank');
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

export const sendTestCaseReviewerThunk = createAsyncThunk(
  'sendTestCaseReviewer',
  async ({ formData, onSuccessHandler, onErrorHandler, type, id }) => {
    try {
      const response = await customAxios.post(
        `testCases/send/sendTestCasesReviewer/${type}/${id}`,
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

export const editTestCaseThunk = createAsyncThunk(
  'editTestCase/editTestCaseThunk',
  async ({ formData, onSuccessHandler, onErrorHandler, currentId }) => {
    try {
      const response = await customAxios.post(
        `testCases/editTestCase/postTestdraftTestcase/${currentId}`,
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

export const getAllReviewTestDraftList = createAsyncThunk(
  'reviewDraftList/getAllReviewTestDraftList',
  async ({ limit, page, filter_testcase_data }) => {
    try {
      const response = await customAxios.get(
        `testCases/getCount/getTestDraft`,
        {
          params: {
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

export const getByTestPlanIDReviewedListThunk = createAsyncThunk(
  'testPlanID/getByTestPlanIDListThunk',
  async ({ id, limit, page, filter_testcase_data }) => {
    try {
      const response = await customAxios.get(
        `testCases/getDraftTestCases/getTestCases`,
        {
          params: {
            id: id,
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

export const testDraftDetailsHistoryThunk = createAsyncThunk(
  'testDraft/testDraftHistory',
  async ({ id, limit, page }) => {
    try {
      const response = await customAxios.get(
        `testCases/history/getTestcasesHistory/${id}?limit=${limit}&page=${page}`
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
