import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { rewampAxios } from '../../../../../http/axios';
import { errorHandler } from '../../../../../utils';

export const getShiftMasterListThunk = createAsyncThunk(
    'getShiftMaster',
    async () => {
        try {
            const response = await rewampAxios.get(`getShiftMaster`);
            if (response?.status === 200) {
                return { data: response?.data, msg: response?.data?.message };
            }
        } catch (error) {
            errorHandler(error?.response);
            return Promise.reject(error?.response?.data?.message);
        }
    }
);
export const addShiftMasterThunk = createAsyncThunk(
    'postShiftMaster',
    async ({ formData, onSuccessHandler, onErrorHandler, currentId }) => {
        try {
            const endPointAPI = currentId ? `postShiftMaster/${currentId}` : `postShiftMaster`

            const response = await rewampAxios.post(endPointAPI, formData);
            if (response?.status === 200) {
                onSuccessHandler();
                toast.success(response?.data?.message);
                return response?.data?.message;
            }
        } catch (error) {
            onErrorHandler();
            errorHandler(error?.response);
        }
    }
);
