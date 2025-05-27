import { createSlice } from '@reduxjs/toolkit';
import { postBotMessages } from '../../services/chatBot/index';
import { act } from 'react';

const initialState = {
  chatBotList: [],
  isLoading: {
    chatBotList: false
  }
};

const chatBotSlice = createSlice({
  name: 'chat Bot',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(postBotMessages.pending, (state, action) => {
        state.isLoading.chatBotList = true;
        state.chatBotList = [];
      })
      .addCase(postBotMessages.fulfilled, (state, action) => {
        state.chatBotList = action?.payload?.answer;
        state.isLoading.chatBotList = false;
      })
      .addCase(postBotMessages.rejected, (state, action) => {
        state.isLoading.chatBotList = false;
        console.error('Error in postBotMessages:', action?.payload);
        if (action?.payload?.name?.toLowerCase() !== 'aborterror') {
          state.chatBotList = 'Error occurred while sending message';
          return;
        }
        // state.chatBotList = ['Error occurred while sending message'];
      });
  }
});

export default chatBotSlice.reducer;
