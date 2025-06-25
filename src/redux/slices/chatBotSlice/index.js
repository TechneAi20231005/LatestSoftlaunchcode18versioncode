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
import {
  postBotMessages,
  reviewerNotificationList,
  reviewerNotificationListByChatId,
  getAllReviewerNotificationList,
  getAllProject
} from '../../services/chatBot/index';

const initialState = {
  chatBotList: null,
  isLoading: {
    chatBotList: false,
    reviewerNotificationList: false,
    reviewerNotificationListByChatId: false,
    getAllReviewerNotificationList: false,
    getAllProject: false
  },
  chatHistory: [],
  reviewerNotificationList: [],
  reviewerNotificationListByChatId: [],
  getAllReviewerNotificationList: [],
  getAllProject: []
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
      })

      //notification list
      .addCase(reviewerNotificationList.pending, (state) => {
        state.isLoading.reviewerNotificationList = true;
      })
      .addCase(reviewerNotificationList.fulfilled, (state, action) => {
        state.reviewerNotificationList = action.payload?.data || [];
        state.isLoading.reviewerNotificationList = false;
      })
      .addCase(reviewerNotificationList.rejected, (state, action) => {
        state.isLoading.reviewerNotificationList = false;
        console.error('Error in postBotMessages:', action.payload);
        state.reviewerNotificationList = [];
      })

      //getNotifiCationByChatId
      .addCase(reviewerNotificationListByChatId.pending, (state) => {
        state.isLoading.reviewerNotificationListByChatId = true;
      })
      .addCase(reviewerNotificationListByChatId.fulfilled, (state, action) => {
        state.reviewerNotificationListByChatId = action.payload?.data || [];
        state.isLoading.reviewerNotificationListByChatId = false;
      })
      .addCase(reviewerNotificationListByChatId.rejected, (state, action) => {
        state.isLoading.reviewerNotificationListByChatId = false;
        console.error('Error in postBotMessages:', action.payload);
        state.reviewerNotificationListByChatId = [];
      })

      //getAllNotificationList
      .addCase(getAllReviewerNotificationList.pending, (state) => {
        state.isLoading.getAllReviewerNotificationList = true;
      })
      .addCase(getAllReviewerNotificationList.fulfilled, (state, action) => {
        console.log(action.payload?.data, 'action.payload?.data');
        state.getAllReviewerNotificationList = action.payload?.data || [];
        state.isLoading.getAllReviewerNotificationList = false;
      })
      .addCase(getAllReviewerNotificationList.rejected, (state, action) => {
        state.isLoading.getAllReviewerNotificationList = false;
        console.error('Error in postBotMessages:', action.payload);
        state.getAllReviewerNotificationList = [];
      })

      //getAllProject
      .addCase(getAllProject.pending, (state) => {
        state.isLoading.getAllProject = true;
      })
      .addCase(getAllProject.fulfilled, (state, action) => {
        state.getAllProject = action.payload?.data || [];
        state.isLoading.getAllProject = false;
      })
      .addCase(getAllProject.rejected, (state, action) => {
        state.isLoading.getAllProject = false;
        console.error('Error in postBotMessages:', action.payload);
        state.getAllProject = [];
      });
  }
});

export const { addMessageToHistory, removeLastMessage } = chatBotSlice.actions;

export default chatBotSlice.reducer;
