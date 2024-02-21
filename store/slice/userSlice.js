import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newRequest from "../../ultils/request";

const initialState = {
    username: '',
    first_name: '',
    last_name: '',
    gender: '',
    avatar: '',
    birth: '',
    role: ''
}

export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async (username) => {
        const response = await newRequest.get(`/users/${username}/`)
        return response.data
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUser: () => {
            return initialState
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserData.fulfilled, (state, action) => {
            state.username = action.payload.data.username
            state.first_name = action.payload.data.first_name
            state.last_name = action.payload.data.last_name
            state.gender = action.payload.data.gender
            state.avatar = action.payload.data.avatar || ''
            state.birth = action.payload.data.birth
            state.role = action.payload.data.group_name
        })
    }
})

export const { clearUser } = userSlice.actions

export default userSlice.reducer