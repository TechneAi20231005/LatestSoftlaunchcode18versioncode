import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customAxios, { rewampAxios } from '../../../../http/axios';
import { errorHandler } from '../../../../utils';
import {
  _apiUrl,
  _attachmentUrl,
  _rewampApiUrl,
  _rewampAttachmentUrl
} from '../../../../settings/constants';

export const getProjectModuleMasterThunk = createAsyncThunk(
  'projectModuleMaster/getProjectModuleMasterList',
  async () => {
    try {
      const response = await rewampAxios.get(`projects/getAllProject`);
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
      const response = await rewampAxios.get(`module/getAllModule`);
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
      const response = await rewampAxios.get(`submodule/getAllSubmodule`);
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
  async ({ project_name, module_name, submodule_name, onSuccessHandler }) => {
    try {
      let endpoint = `draftFile/getTestdraftBulkFormat?project_name=${project_name}`;

      // Append submodule_id parameters if they are provided

      if (module_name && module_name.length >= 0) {
        const moduleQueryParam = module_name
          .map((id) => `module_name[]=${id}`)
          .join('&');
        endpoint += `&${moduleQueryParam}`;
      }
      if (submodule_name && submodule_name.length >= 0) {
        const submoduleQueryParam = submodule_name
          .map((id) => `submodule_name[]=${id}`)
          .join('&');
        endpoint += `&${submoduleQueryParam}`;
      }

      const response = await rewampAxios.get(endpoint);
      if (response?.status === 200 || response?.status === 201) {
        window.open(`${_rewampApiUrl}${endpoint}`, '_parent').focus();
        toast.success('File Downloaded Successfully');
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
  async ({ ticketId, taskId, limit, page, filter_testcase_data }) => {
    try {
      const response = await rewampAxios.get(
        `testCases/getDraftTestCases/getTestCases`,
        {
          params: {
            ticket_id: ticketId,
            task_id: taskId,
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
          return { data: response?.data, msg: response?.data?.message };
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
      const response = await rewampAxios.get(
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
      const response = await rewampAxios.post(
        `testCases/addDraft/postTestdraftImportTestcases`,
        formData
      );
      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          onSuccessHandler();
          toast.success(response?.data?.message);
          return { data: response?.data.data, msg: response?.data?.message };
        } else {
          // onErrorHandler();
          // console.log('rrrr', response.data.data);
          // console.log('_rewampAttachmentUrl', _rewampAttachmentUrl);
          // toast.error(response?.data?.message);

          // const url = `${_rewampAttachmentUrl}` + response.data.data;
          // window.open(url, '_blank');

          onErrorHandler();
          console.log('rrrr', response.data.data);
          console.log('_rewampAttachmentUrl', _rewampAttachmentUrl);

          if (
            Array.isArray(response.data.data) &&
            response.data.data.length === 0
          ) {
            toast.error(
              response?.data?.message || 'No data available to download.'
            );
          } else {
            toast.error(response?.data?.message);
            const url = `${_rewampAttachmentUrl}${response.data.data}`;
            window.open(url, '_blank');
          }
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
      const response = await rewampAxios.post(
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

export const sendTestPlanReviewerThunk = createAsyncThunk(
  'sendTestPlanReviewerThunk',
  async ({ formData, onSuccessHandler, onErrorHandler, id }) => {
    try {
      const response = await rewampAxios.post(
        `testCases/updateTestCaseReviewerData/${id}`,
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
      const response = await rewampAxios.post(
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

export const addTestCaseThunk = createAsyncThunk(
  'addTestCase/addTestCaseThunk',
  async ({ formData, onSuccessHandler, onErrorHandler, currentId }) => {
    try {
      const response = await rewampAxios.post(
        `testCases/addTestCase`,
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
// // reviewed export data
export const getExportAllReviewTestDraftList = createAsyncThunk(
  'reviewDraftListExport/getExportAllReviewTestDraftList',
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

export const getByTestPlanIDReviewedListThunk = createAsyncThunk(
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

export const testDraftDetailsHistoryThunk = createAsyncThunk(
  'testDraft/testDraftHistory',
  async ({ id, limit, page }) => {
    try {
      const response = await rewampAxios.get(
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

export const testPlansHistoryThunk = createAsyncThunk(
  'getTestPlanHistoryData',
  async ({ id, limit, page }) => {
    try {
      const response = await rewampAxios.get(
        `testCases/getTestPlanHistoryData/${id}?limit=${limit}&page=${page}`
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

export const getTestCaseStatusDataList = createAsyncThunk(
  'getTestCaseStatusDataList/getTestCaseStatusData',
  async ({ limit, page }) => {
    try {
      const response = await rewampAxios.get(
        `testCases/getTestCaseStatusData`,
        {
          params: {
            limit: limit,
            page: page
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
