import { createAsyncThunk } from '@reduxjs/toolkit';
import { postData } from '../../../services/loginService';

export const postLoginUser = createAsyncThunk(
  'postLoginUser',
  async (config, thunkapi) => {
    try {
      const res = await postData(config);

      if (res?.status === 200 && res?.data?.status === 1) {
        const data = res.data.data;
        const token = res?.data?.token;

        console.log(data, 'data');

        if (data.departments && Array.isArray(data.departments)) {
          data.departments = data.departments
            .map((dept) => dept.department)
            .join(', ');
        }
        Object.keys(data).forEach((key) => {
          const value = data[key];

          if (typeof value === 'object' && value !== null) {
            localStorage.setItem(key, JSON.stringify(value));
          } else {
            localStorage.setItem(key, value);
          }
        });

        // Store JWT token
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
