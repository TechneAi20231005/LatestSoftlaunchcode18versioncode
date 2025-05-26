import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
// import customAxios, { rewampAxios } from '../../../../../http/axios';
import errorHandler from '../../../utils/errorHandler';
import axios from 'axios';
export const postBotMessages = createAsyncThunk(
  'chatBot/postBotMessages',
  async ({ formData }, { signal, rejectWithValue }) => {
    try {
      const controller = new AbortController();
      signal.addEventListener('abort', () => {
        controller.abort();
      });

      const response = await axios.post(
        `http://10.2.9.154:8000/chatbot/`,
        formData,
        { signal: controller.signal }
      );

      if (response?.status === 200 || response?.status === 201) {
        return response?.data;
      } else {
        // errorHandler(response);
        return rejectWithValue('Unexpected response');
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        // console.log('Request canceled:', error.message);
        return rejectWithValue('Request was cancelled');
      }
      console.error(error);
      // errorHandler(error?.response);
      return rejectWithValue(
        error?.response?.data?.message || 'Request failed'
      );
    }
  }
);
