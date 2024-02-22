import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newRequest from "../../ultils/request";

const initialState = []

export const fetchSchedulesData = createAsyncThunk(
    'schedules/fetchSchedulesData',
    async ({ access_token, date }) => {
        try {
            const response = await newRequest.get(`/schedules/?date=${date}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            return response.data
        }
        catch (err) {
            console.log('Error from fetchSchedulesData: ', err)
        }
    }

)

export const updateSchedules = createAsyncThunk(
    'schedules/updateSchedules',
    async (data) => {
        try {

            const { access_token, scheduleId, updateData } = data
            console.log('access_token ', access_token)
            console.log('scheduleId ', scheduleId)
            console.log('updateData ', updateData)

            const response = await newRequest.patch(`/schedules/${scheduleId}/`, updateData, {
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-Type": 'application/json'
                }
            })
            console.log('response.data: ', response.data)
            return response.data
        }
        catch (err) {
            console.log('Error from updateSchedule: ', err)
        }
    }
)

export const deleteSchedule = createAsyncThunk(
    'schedules/deleteNurse',
    async ({ access_token, scheduleId }) => {
        try {
            const response = await newRequest.delete(`/schedules/${scheduleId}/`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            console.log('response.data delete: ', scheduleId)
            return scheduleId
        } catch (err) {
            console.log('Error from deleteSchedule: ', err)
        }
    }
)

export const createSchedule = createAsyncThunk(
    'schedules/createSchedule',
    async ({ access_token, data }) => {

        try {
            const response = await newRequest.post(`/schedules/`, data, {
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            });
            console.log('response from createSchedule: ', response.data)
            return response.data
        } catch (err) {
            console.log('Error from createSchedule: ', err)
        }
    }
)

export const scheduleSlice = createSlice({
    name: 'schedules',
    initialState,
    reducers: {
        clearSchedules: () => {
            return initialState
        },
        addNewSchedules: (state, action) => {
            const existingIds = state.results.map(schedule => schedule.id)
            const newSchedules = action.payload.results.filter(
                schedule => !existingIds.includes(schedule.id)
            )
            console.log('addnewschedules: ', {
                ...state,
                count: state.count + newSchedules.length,
                results: [...state.results, ...newSchedules]
            })
            return {
                ...state,
                count: state.count + newSchedules.length,
                results: [...state.results, ...newSchedules]
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSchedulesData.fulfilled, (state, action) => {
            return action.payload
        }),
            builder.addCase(updateSchedules.fulfilled, (state, action) => {
                const updatedSchedule = action.payload

                const updatedResults = state.results.map(schedule => {
                    if (schedule.id === updatedSchedule.id) {

                        return {
                            ...updatedSchedule
                        }
                    }
                    return schedule;
                });

                return {
                    ...state,
                    results: [...updatedResults]
                }
            }),
            builder.addCase(deleteSchedule.fulfilled, (state, action) => {
                const newSchedules = state.results.filter(schedule => schedule.id !== action.payload)
                return {
                    ...state,
                    results: [...newSchedules]
                }
            }),
            builder.addCase(createSchedule.fulfilled, (state, action) => {
                return {
                    ...state,
                    result: {
                        ...state.result,
                        ...action.payload
                    }
                }
            })
    }
})

export const {
    clearNurses,
    addNewSchedules
} = scheduleSlice.actions

export default scheduleSlice.reducer