import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    newUsernameRegister: '',
    newPasswordRegister: ''
}

export const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {
        setNewUsernameRegister: (state, action) => {
            return {
                ...state,
                newUsernameRegister: action.payload
            }
        },
        setNewPasswordRegister: (state, action) => {
            return {
                ...state,
                newPasswordRegister: action.payload
            }
        },
    },
    extraReducers: (builder) => { }
})

export default registerSlice.reducer

export const { setNewUsernameRegister, setNewPasswordRegister }
= registerSlice.actions