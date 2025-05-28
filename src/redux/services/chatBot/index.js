import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
// import customAxios, { rewampAxios } from '../../../../../http/axios';
import errorHandler from '../../../utils/errorHandler';
import axios from 'axios';
export const postBotMessages = createAsyncThunk(
  'chatBot/postBotMessages',
  async ({ formData, signal }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://10.2.9.154:8000/chatbot/`,
        formData,
        { signal }
      );

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
