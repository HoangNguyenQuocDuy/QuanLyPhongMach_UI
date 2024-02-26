import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import newRequest from "../../ultils/request"

const initialState = {
    username: '',
    access_token: '',
    refresh_token: ''
}

export const fetchLogin = createAsyncThunk(
    'account/fetchLogin',
    async ({ username, password }) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('client_id', 'WIXe9P1gMJs3euUDVtpOkpfxuhUv0D7dvNX6Bscl');
        formData.append('client_secret', 'meYnTpYnrFNGpkdxJTmrYCnOr2SQAxU6ZJ8HyPq0qDJ8BF0P93kHKzjJfkvDZ8XOVCXHquNomBb7J4zmWFNlIXadCaTCvfJthbznxdRz35kks77tCGmbsmqcqfxDAz1j');
        formData.append('grant_type', 'password');
        try {
            const response = await newRequest.post('/o/token/', formData,
            {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            })

            return response.data
        } catch (error) {
            throw error
        }
    }
)

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        login: (state, action) => {
            return {
                username: action.payload.username,
                access_token: action.payload.access_token,
                refresh_token: action.payload.refresh_token,
            }
        },
        logout: () => {
            return initialState
        },
        // refreshToken: (state, action) => {
        //     return {
        //         ...state,
        //         ...action.payload
        //     }
        // }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchLogin.fulfilled, (state, action) => {
            return action.payload
        })
        // builder.addCase(fetchRefreshToken.fulfilled, (state, action) => {
        //     return action.payload
        // })
    }
})

export default accountSlice.reducer

export const { login, logout } = accountSlice.actions
