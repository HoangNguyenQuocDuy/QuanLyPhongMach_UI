import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpenUserInfoTag: false,
    usernameTagActive: '',
    optionUserTagActive: '',
    userRoleIdTagActive: '',
    showConfirmation: false,
    isOpenAddUserBox: false,
    titleAddUserBox: 0,
    isOpenScheduleInfo: false,
    scheduleIdActive: ''
}


export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        toggleIsOpenUserInfoTag: (state) => {
            return {
                ...state,
                isOpenUserInfoTag: !state.isOpenUserInfoTag
            }
        },
        setUsernameTagActive: (state, action) => {
            return {
                ...state,
                usernameTagActive: action.payload
            }
        },
        setOptionUserTagActive: (state, action) => {
            return {
                ...state,
                optionUserTagActive: action.payload
            }
        },
        setUserRoleIdTagActive: (state, action) => {
            return {
                ...state,
                userRoleIdTagActive: action.payload
            }
        },
        setShowConfirmation: (state, action) => {
            return {
                ...state,
                showConfirmation: action.payload
            }
        },
        setIsOpenAddUserBox: (state, action) => {
            return {
                ...state,
                isOpenAddUserBox: action.payload
            }
        },
        setTitleAddUserBox: (state, action) => {
            return {
                ...state,
                titleAddUserBox: action.payload
            }
        },
        toggleIsOpenScheduleInfo: (state, action) => {
            return{
                ...state,
                isOpenScheduleInfo: action.payload
            }
        },
        setScheduleIdActive: (state, action) => {
            return { 
                ...state, 
                scheduleIdActive: action.payload
            }
        }
    },
    extraReducers: (builder) => {

    }
})

export default appSlice.reducer

export const { toggleIsOpenUserInfoTag, setUsernameTagActive, setIsOpenAddUserBox,
    setOptionUserTagActive, setUserRoleIdTagActive, setShowConfirmation, 
    setTitleAddUserBox, toggleIsOpenScheduleInfo, setScheduleIdActive }
    = appSlice.actions
