// import { createSlice } from '@reduxjs/toolkit';
// import { postBotMessages } from '../../services/chatBot/index';

// const initialState = {
//   chatBotList: null,
//   isLoading: {
//     chatBotList: false
//   }
// };

// const chatBotSlice = createSlice({
//   name: 'chat Bot',
//   initialState,
//   reducers: {},
//   extraReducers(builder) {
//     builder
//       .addCase(postBotMessages.pending, (state, action) => {
//         state.isLoading.chatBotList = true;
//         state.chatBotList = null;
//       })
//       .addCase(postBotMessages.fulfilled, (state, action) => {
//         console.log(action?.payload, 'action?.payload');
//         state.chatBotList = action?.payload;
//         state.isLoading.chatBotList = false;
//       })
//       .addCase(postBotMessages.rejected, (state, action) => {
//         state.isLoading.chatBotList = false;
//         console.error('Error in postBotMessages:', action?.payload);
//         if (action?.payload?.name?.toLowerCase() !== 'aborterror') {
//           let payload = {
//             answer: 'Error occurred while sending message'
//           };
//           state.chatBotList = payload;
//           return;
//         }
//         // state.chatBotList = ['Error occurred while sending message'];
//       });
//   }
// });

// export default chatBotSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { postBotMessages } from '../../services/chatBot/index';

const initialState = {
  chatBotList: null,
  isLoading: {
    chatBotList: false
  },
  chatHistory: []
};

const chatBotSlice = createSlice({
  name: 'chatBot',
  initialState,
  reducers: {
    addMessageToHistory(state, action) {
      state.chatHistory.push(action.payload);
    },
    removeLastMessage: (state) => {
      if (state.chatHistory.length) {
        state.chatHistory.pop();
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(postBotMessages.pending, (state) => {
        state.isLoading.chatBotList = true;
      })
      .addCase(postBotMessages.fulfilled, (state, action) => {
        state.chatBotList = action.payload;
        state.isLoading.chatBotList = false;
        if (action.payload?.answer) {
          state.chatHistory.push({ role: 'model', text: action.payload });
        }
      })
      .addCase(postBotMessages.rejected, (state, action) => {
        state.isLoading.chatBotList = false;
        console.error('Error in postBotMessages:', action.payload);
        if (action.payload?.name?.toLowerCase() !== 'aborterror') {
          state.chatHistory.push({
            role: 'model',
            text: {
              answer: 'Error occurred while sending message'
            }
          });
        }
      });
  }
});

export const { addMessageToHistory, removeLastMessage } = chatBotSlice.actions;

export default chatBotSlice.reducer;
