import { createSlice } from '@reduxjs/toolkit'
import { postLoginUser } from './loginAction'

const initialState = {
    status: "",
    err: "",
    loginUserDetail: {},
    data: []
}

export const loginSlice = createSlice({
    name: 'loginSlice',
    initialState,
    reducers: {
    },
    extraReducers:
        (builder) => {

            builder.addCase(postLoginUser.pending, (state) => {
                state.status = 'loading'
            });
            builder.addCase(postLoginUser.fulfilled, (state, action) => {
                state.status = 'succeded';
                console.log("action", action)

            });
            builder.addCase(postLoginUser.rejected, (state) => {
                state.status = 'rejected'
            });

        }

})

export default loginSlice.reducer