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
    scheduleIdActive: '',
    isLoadSchedulesSearched: false,
    isOpenAddScheduleBox: false
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
                isOpenScheduleInfo: !state.isOpenScheduleInfo
            }
        },
        setScheduleIdActive: (state, action) => {
            return { 
                ...state, 
                scheduleIdActive: action.payload
            }
        },
        setIsLoadSchedulesSearched: (state, action) => {
            return {
                ...state,
                isLoadSchedulesSearched: action.payload
            }
        },
        toggleIsOpenAddScheduleBox: (state, action) => {
            return {
                ...state,
                isOpenAddScheduleBox: !state.isOpenAddScheduleBox
            }
        }
    },
    extraReducers: (builder) => {

    }
})

export default appSlice.reducer

export const { toggleIsOpenUserInfoTag, setUsernameTagActive, setIsOpenAddUserBox,
    setOptionUserTagActive, setUserRoleIdTagActive, setShowConfirmation, 
    setTitleAddUserBox, toggleIsOpenScheduleInfo, setScheduleIdActive,
    setIsLoadSchedulesSearched, toggleIsOpenAddScheduleBox }
    = appSlice.actions
