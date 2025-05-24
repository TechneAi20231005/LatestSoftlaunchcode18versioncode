import { createSlice } from '@reduxjs/toolkit';
import { postBotMessages } from '../../services/chatBot/index';

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
      })
      .addCase(postBotMessages.fulfilled, (state, action) => {
        state.chatBotList = action?.payload?.answer;
        state.isLoading.chatBotList = false;
      })
      .addCase(postBotMessages.rejected, (state, action) => {
        state.isLoading.chatBotList = false;
        state.chatBotList = ['Error occurred while sending message'];
      });
  }
});

export default chatBotSlice.reducer;
