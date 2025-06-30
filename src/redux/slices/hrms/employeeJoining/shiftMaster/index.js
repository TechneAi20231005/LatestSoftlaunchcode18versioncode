import { createSlice } from '@reduxjs/toolkit';
import {
    addShiftMasterThunk,
    editShiftMasterThunk,
    getShiftMasterListThunk
} from '../../../../services/hrms/employeeJoining/shiftMaster';

const initialState = {
    shiftMasterList: [],
    isLoading: {
        getShiftMasterList: false,
        addShiftMaster: false,
        editShiftMaster: false
    },
    errorMsg: {
        getShiftMasterList: '',
        addShiftMaster: '',
        editShiftMaster: ''
    },
    successMsg: {
        getShiftMasterList: '',
        addShiftMaster: '',
        editShiftMaster: ''
    }
};
const shiftMasterSlice = createSlice({
    name: 'Shift master',
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder
            .addCase(getShiftMasterListThunk.pending, (state, action) => {
                state.isLoading.getShiftMasterList = true;
            })
            .addCase(getShiftMasterListThunk.fulfilled, (state, action) => {
                state.isLoading.getShiftMasterList = false;
                let updatedData = action?.payload?.data?.data
                state.shiftMasterList = updatedData;
                state.successMsg.getShiftMasterList = action.payload;
            })
            .addCase(getShiftMasterListThunk.rejected, (state, action) => {
                state.isLoading.getShiftMasterList = false;
                state.shiftMasterList = [];
                state.errorMsg.getShiftMasterList = action.error.message;
            })

            //add shift

            .addCase(addShiftMasterThunk.pending, (state, action) => {
                state.isLoading.addShiftMaster = true;
            })
            .addCase(addShiftMasterThunk.fulfilled, (state, action) => {
                state.isLoading.addShiftMaster = false;
                state.successMsg.addShiftMaster = action.payload;
            })
            .addCase(addShiftMasterThunk.rejected, (state, action) => {
                state.isLoading.addShiftMaster = false;
                state.errorMsg.addShiftMaster = action.error.message;
            })
    }
});

export default shiftMasterSlice.reducer;
