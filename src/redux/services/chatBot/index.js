import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
// import customAxios, { rewampAxios } from '../../../../../http/axios';
import { _chatbotUrl } from '../../../settings/constants';
import errorHandler from '../../../utils/errorHandler';
import axios from 'axios';
export const postBotMessages = createAsyncThunk(
  'chatBot/postBotMessages',
  async ({ formData, signal }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${_chatbotUrl}chatbot/`, formData, {
        signal
      });

      if (response?.status === 200 || response?.status === 201) {
        return response?.data;
      } else {
        return rejectWithValue('Unexpected response');
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        return rejectWithValue({
          message: 'Request cancelled',
          name: 'AbortError'
        });
      }
      console.error(error);
      return rejectWithValue(
        error?.response?.data?.message || 'Request failed'
      );
    }
  }
);

export const flagBotMessage = createAsyncThunk(
  'chatBot/flagBotMessage',
  async ({ formData }) => {
    try {
      const token = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.post(
        `${_chatbotUrl}update-flagging`,
        formData,
        config
      );
      if (response?.status === 200 || response?.status === 201) {
        return response?.data?.data;
      }
    } catch (error) {
      return Promise.reject(error?.response?.data?.message);
    }
  }
);

export const reviewerNotificationList = createAsyncThunk(
  'chatBot/reviewerNotificationList',
  async ({ project_id, chat_id }) => {
    try {
      const params = new URLSearchParams();

      if (project_id) params.append('project_id', project_id);
      if (chat_id) params.append('chat_entry_uuid', chat_id);
      const response = await axios.get(
        `${_chatbotUrl}flagged-entries?${params.toString()}`
      );
      if (response?.status === 200 || response?.status === 201) {
        return { data: response?.data, msg: response?.data?.message };
      } else {
        // errorHandler(response);
      }
    } catch (error) {
      // errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  }
);

export const reviewerNotificationListByChatId = createAsyncThunk(
  'chatBot/reviewerNotificationListByChatId',
  async ({ project_id, chat_id }) => {
    try {
      const params = new URLSearchParams();

      if (project_id) params.append('project_id', project_id);
      if (chat_id) params.append('chat_entry_uuid', chat_id);
      const response = await axios.get(
        `${_chatbotUrl}flagged-entries?${params.toString()}`
      );
      if (response?.status === 200 || response?.status === 201) {
        return { data: response?.data, msg: response?.data?.message };
      } else {
        // errorHandler(response);
      }
    } catch (error) {
      // errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  }
);
export const getAllReviewerNotificationList = createAsyncThunk(
  'chatBot/getAllReviewerNotificationList',
  async () => {
    try {
      const response = await axios.get(`${_chatbotUrl}flagged-entries`);
      if (response?.status === 200 || response?.status === 201) {
        return { data: response?.data, msg: response?.data?.message };
      } else {
        // errorHandler(response);
      }
    } catch (error) {
      // errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  }
);

export const submitFeedback = createAsyncThunk(
  'chatBot/submitFeedback',
  async ({ formData, onSuccessHandler, onErrorHandler }) => {
    try {
      const token = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.post(
        `${_chatbotUrl}edit-flagged-entry`,
        formData,
        config
      );
      if (response?.status === 200 || response?.status === 201) {
        onSuccessHandler();
        return response?.data?.data;
      } else {
        onErrorHandler();

        errorHandler(response);
      }
    } catch (error) {
      return Promise.reject(error?.response?.data?.message);
    }
  }
);

export const getAllProject = createAsyncThunk(
  'chatBot/getAllProject',
  async () => {
    try {
      const response = await axios.get(`${_chatbotUrl}projects`);
      if (response?.status === 200 || response?.status === 201) {
        return { data: response?.data, msg: response?.data?.message };
      } else {
        // errorHandler(response);
      }
    } catch (error) {
      // errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  }
);

export const getAllHistoryByProjectId = createAsyncThunk(
  'chatBot/getAllHistoryByProjectId',
  async ({ project_id, user_id }) => {
    try {
      const response = await axios.get(
        `${_chatbotUrl}user-chats/${project_id}/${user_id}`
      );
      if (response?.status === 200 || response?.status === 201) {
        return { data: response?.data, msg: response?.data?.message };
      } else {
        // errorHandler(response);
      }
    } catch (error) {
      // errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  }
);
