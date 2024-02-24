import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newRequest from "../../ultils/request";

const initialState = []

export const fetchDoctorsData = createAsyncThunk(
    'doctors/fetchDoctorsData',
    async ({ access_token }) => {
        try {
            const response = await newRequest.get(`/doctors/`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            return response.data
        }
        catch (err) {
            console.log('Error from fetchDoctorsData: ', err)
        }
    }
)

export const getDoctorById = createAsyncThunk(
    'doctors/getDoctorById',
    async ({ access_token, doctorId }) => {
        console.log('doctorId ',doctorId)
        try {
            const response = await newRequest.get(`/doctors/${doctorId}/`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            console.log('response get: ', response.data)
            return response.data
        }
        catch (err) {
            console.log('Error from getDoctorById: ', err)
        }
    }
)

export const updateDoctors = createAsyncThunk(
    'doctors/updateDoctors',
    async (data) => {
        const { access_token, doctorId, updateData } = data

        try {
            const response = await newRequest.patch(`/doctors/${doctorId}/`, updateData, {
                headers: {
                    "Content-Type": 'multipart/form-data',
                    'Authorization': `Bearer ${access_token}`
                }
            });
            return response.data
        } catch (err) {
            console.log('Error from updateDoctors: ', err)
        }
    }
)

export const deleteDoctor = createAsyncThunk(
    'doctors/deleteDoctor',
    async ({ access_token, doctorId }) => {
        try {
            const response = await newRequest.delete(`/doctors/${doctorId}/`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            console.log('response.data delete: ', response.data)
            return doctorId
        } catch (err) {
            console.log('Error from deleteDoctor: ', err)
        }
    }
)

export const createDoctor = createAsyncThunk(
    'doctors/createDoctor',
    async ({ access_token, data }) => {
        console.log('token: ', access_token)
        console.log('data: ', data)

        try {
            const response = await newRequest.post(`/doctors/`, data, {
                headers: {
                    "Content-Type": 'multipart/form-data',
                    'Authorization': `Bearer ${access_token}`
                }
            });
            console.log('response from createDoctor: ', response.data.data)
            return response.data.data
        } catch (err) {
            console.log('Error from createDoctor1: ', err)
        }
    }
)

export const doctorsSlice = createSlice({
    name: 'doctors',
    initialState,
    reducers: {
        clearDoctors: () => {
            return initialState
        },
        addNewDoctors: (state, action) => {
            const exitingIds = state.map(doctor => doctor.id) 
            const newDoctors = action.payload.filter(doctor => !exitingIds.includes(doctor.id))
            
            return [...state, ...newDoctors]
        }
        // deleteDoctor: (state, action) => {
        //     const newDoctors = state.results.filter(doctor => doctor.id !== action.payload)
        //     return {
        //         ...state,
        //         results: [...newDoctors]
        //     }
        // }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDoctorsData.fulfilled, (state, action) => {
            // if (Object.keys(state).length > 0) {
            //     const existingIds = state.map(doctor => doctor.id);
            //     const newDoctors = action.payload.results.filter(
            //         doctor => !existingIds.includes(doctor.id));
            //     return [...state, ...newDoctors];

            // } else {
            return action.payload
            // }
        }),
            builder.addCase(updateDoctors.fulfilled, (state, action) => {
                const updatedDoctor = action.payload

                const updatedResults = state.map(doctor => {
                    if (doctor.id === updatedDoctor.id) {
                        console.log('doctor 1 ', doctor)

                        return {
                            ...updatedDoctor
                        }
                    }
                    return doctor;
                });

                return [...updatedResults]
            }),
            builder.addCase(deleteDoctor.fulfilled, (state, action) => {
                const newDoctors = state.filter(doctor => doctor.id !== action.payload)
                return [...newDoctors]

            }),
            builder.addCase(createDoctor.fulfilled, (state, action) => {
                return [...state]
            }),
            builder.addCase(getDoctorById.fulfilled, (state, action) => {
                console.log('action.payload get: ', action.payload)
                return [
                    ...state,
                    action.payload
                ]
            })
    }
})

export const {
    clearDoctors, addNewDoctors
} = doctorsSlice.actions

export default doctorsSlice.reducer