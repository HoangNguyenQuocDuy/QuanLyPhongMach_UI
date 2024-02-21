import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newRequest from "../../ultils/request";

const initialState = []

export const fetchNursesData = createAsyncThunk(
    'nurses/fetchNursesData',
    async ({ access_token }) => {
        try {
            const response = await newRequest.get(`/nurses/`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            return response.data
        }
        catch (err) {
            console.log('Error from fetchNursesData: ', err)
        }
    }
)

export const updateNurse = createAsyncThunk(
    'nurses/updateNurse',
    async (data) => {
        const { access_token, nurseId, updateData } = data

        try {
            const response = await newRequest.patch(`/nurses/${nurseId}/`, updateData, {
                headers: {
                    "Content-Type": 'multipart/form-data',
                    'Authorization': `Bearer ${access_token}`
                }
            });
            return response.data
        } catch (err) {
            console.log('Error from updateNurse: ', err)
        }
    }
)

export const deleteNurse = createAsyncThunk(
    'nurses/deleteNurse',
    async ({ access_token, nurseId }) => {
        try {
            const response = await newRequest.delete(`/nurses/${nurseId}/`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            console.log('response.data delete: ', response.data)
            return nurseId
        } catch (err) {
            console.log('Error from deleteDoctor: ', err)
        }
    }
)

export const createNurse = createAsyncThunk(
    'nurses/createNurse',
    async ({ access_token, data }) => {

        try {
            const response = await newRequest.post(`/nurses/`, data, {
                headers: {
                    "Content-Type": 'multipart/form-data',
                    'Authorization': `Bearer ${access_token}`
                }
            });
            console.log('response from createNurse: ', response.data)
            return response.data
        } catch (err) {
            console.log('Error from createNurse: ', err)
        }
    }
)

export const doctorsSlice = createSlice({
    name: 'nurses',
    initialState,
    reducers: {
        clearNurses: () => {
            return initialState
        },
        // deleteDoctor: (state, action) => {
        //     const newDoctors = state.results.filter(doctor => doctor.id !== action.payload)
        //     return {
        //         ...state,
        //         results: [...newDoctors]
        //     }
        // }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchNursesData.fulfilled, (state, action) => {
            // if (Object.keys(state).length > 0) {
            //     const existingIds = state.map(doctor => doctor.id);
            //     const newDoctors = action.payload.results.filter(
            //         doctor => !existingIds.includes(doctor.id));
            //     return [...state, ...newDoctors];

            // } else {
            return action.payload
            // }
        }),
            builder.addCase(updateNurse.fulfilled, (state, action) => {
                const updatedNurse = action.payload

                const updatedResults = state.map(nurse => {
                    if (nurse.id === updatedNurse.id) {

                        return {
                            ...updatedNurse
                        }
                    }
                    return nurse;
                });

                return [...updatedResults]
            }),
            builder.addCase(deleteNurse.fulfilled, (state, action) => {
                const newNurses = state.filter(nurse => nurse.id !== action.payload)
                return [...newNurses]
            }),
            builder.addCase(createNurse.fulfilled, (state, action) => {
                return [
                    ...state,
                    action.payload
                ]
            })
    }
})

export const {
    clearNurses
} = doctorsSlice.actions

export default doctorsSlice.reducer