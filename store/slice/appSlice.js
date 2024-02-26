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
    isLoadMedicinesSearched: false,
    isOpenAddScheduleBox: false,
    isOpenUpdateMedicineBox: false,
    medicineIdActive: '',
    isOpenAddMedicineBox: false,
    isAlreadyRegister: false,
    isOpenAddAppointmentBox: false,
    isReloadAppointment: false,
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
            return {
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
        },
        toggleIsOpenUpdateMedicineBox: (state, action) => {
            return {
                ...state,
                isOpenUpdateMedicineBox: !state.isOpenUpdateMedicineBox
            }
        }, 
        setMedicineIdActive: (state, action) => {
            return {
                ...state,
                medicineIdActive: action.payload
            }
        },
        setIsLoadMedicinesSearched: (state, action) => {
            return {
                ...state,
                isLoadMedicinesSearched: action.payload
            }
        },
        toggleIsOpenAddMedicineBox: (state, action) => {
            return {
                ...state, 
                isOpenAddMedicineBox: !state.isOpenAddMedicineBox
            }
        },
        setIsAlreadyRegister: (state, action) => {
            return {
                ...state,
                isAlreadyRegister: !state.isAlreadyRegister
            }
        },
        toggleIsOpenAddAppointmentBox: (state, action) => {
            return {
                ...state, 
                isOpenAddAppointmentBox: !state.isOpenAddAppointmentBox
            }
        },
        setIsReloadAppointment:(state, action) => {
            return {
                ...state,
                isReloadAppointment: action.payload
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
    setIsLoadSchedulesSearched, toggleIsOpenAddScheduleBox, toggleIsOpenUpdateMedicineBox,
    setMedicineIdActive, setIsLoadMedicinesSearched, toggleIsOpenAddMedicineBox,
    setIsAlreadyRegister, toggleIsOpenAddAppointmentBox, setIsReloadAppointment }
    = appSlice.actions
