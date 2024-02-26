import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newRequest from "../../ultils/request";

const initialState = {
    username: '',
    first_name: '',
    last_name: '',
    gender: '',
    avatar: '',
    birth: '',
    role: '',
    email: ''
}

export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async (username) => {
        try {
            const response = await newRequest.get(`/users/${username}/`)
            return response.data
        }
        catch (err) {
            console.log('Error from createMedicine: ', err)
        }
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
            state.username = action.payload.username
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
            state.gender = action.payload.gender
            state.avatar = action.payload.avatar || ''
            state.birth = action.payload.birth
            state.role = action.payload.group_name
            state.email = action.payload.email
        })
    }
})

export const { clearUser } = userSlice.actions

export default userSlice.reducer