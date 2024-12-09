import { createAsyncThunk } from '@reduxjs/toolkit';
import { postData } from '../../../services/loginService';

export const postLoginUser = createAsyncThunk(
  'postLoginUser',
  async (config, thunkapi) => {
    try {
      const res = await postData(config);

      if (res?.status === 200 && res?.data?.status === 1) {
        const data = res.data;
        const token = res?.token;

        Object.keys(data).forEach((key) => {
          // sessionStorage.setItem(key, data[key]);
          localStorage.setItem(key, data[key]);
        });
        // sessionStorage.setItem('jwt_token', token);
        localStorage.setItem('jwt_token', token);

        return res.data;
      } else {
        return res.data.message;
      }
    } catch (error) {
      throw error;
    }
  }
);
