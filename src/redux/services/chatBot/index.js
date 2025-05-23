import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
// import customAxios, { rewampAxios } from '../../../../../http/axios';
import errorHandler from '../../../utils/errorHandler';
import axios from 'axios';

export const postBotMessages = createAsyncThunk(
  'chatBot/postBotMessages',
  async ({ formData, onSuccessHandler, onErrorHandler }) => {
    try {
      const response = await axios.post(
        `http://10.2.9.154:8001/chatbot/`,
        formData
      );
      if (response?.status === 200 || response?.status === 201) {
        // onSuccessHandler();
        return response?.data;
      } else {
        // onErrorHandler();
        errorHandler(response);
      }
    } catch (error) {
      //   onErrorHandler();
      console.log(error, 'error');
      errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  }
);
