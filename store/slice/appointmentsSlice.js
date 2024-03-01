import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newRequest from "../../ultils/request";

const initialState = []

export const fetchAppointmentsData = createAsyncThunk(
    'appointments/fetchAppointmentsData',
    async ({ access_token, date, page }) => {
        try {
            const response = await newRequest.get(`/appointments/?date=${date}&page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            return response.data
        }
        catch (err) {
            console.log('Error from fetchAppointmentsData: ', err)
        }
    }

)

export const updateAppointments = createAsyncThunk(
    'appointments/updateAppointments',
    async (data) => {
        try {

            const { access_token, appointmentId, updateData } = data
            console.log('access_token ', access_token)
            console.log('appointmentId ', appointmentId)
            console.log('updateData ', updateData)

            const response = await newRequest.patch(`/appointments/${appointmentId}/`, updateData, {
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-Type": 'application/json'
                }
            })
            console.log('response.data updateAppointments: ', response.data)
            return response.data
        }
        catch (err) {
            console.log('Error from updateAppointment: ', err)
        }
    }
)

export const deleteAppointment = createAsyncThunk(
    'appointments/deleteAppointment',
    async ({ access_token, appointmentId }) => {
        try {
            const response = await newRequest.delete(`/appointments/${appointmentId}/`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            console.log('response.data delete: ', appointmentId)
            return appointmentId
        } catch (err) {
            console.log('Error from deleteAppointment: ', err)
        }
    }
)

export const createAppointment = createAsyncThunk(
    'appointments/createAppointment',
    async ({ access_token, data }) => {
        console.log(access_token, data)

        try {
            const response = await newRequest.post(`/appointments/`, data, {
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            });
            console.log('response from createAppointment: ', response.data)
            return response.data
        } catch (err) {
            console.log('Error from createAppointment: ', err)
        }
    }
)

export const appointmentsSlice = createSlice({
    name: 'appointments',
    initialState,
    reducers: {
        clearAppointments: () => {
            return initialState
        },
        addNewAppointments: (state, action) => {
            const existingIds = state.results.map(appointment => appointment.id)
            const newAppointments = action.payload.results.filter(
                appointment => !existingIds.includes(appointment.id)
            )
            console.log('addnewappointments: ', {
                ...state,
                count: state.count + newAppointments.length,
                results: [...state.results, ...newAppointments]
            })
            return {
                ...state,
                count: state.count + newAppointments.length,
                results: [...state.results, ...newAppointments]
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAppointmentsData.fulfilled, (state, action) => {
            if (Object.keys(state).length > 0) {
                const existingIds = state.results.map(appointment => appointment.id)
                const newAppointments = action.payload.results.filter(
                    appointment => !existingIds.includes(appointment.id))
                return {
                    ...state,
                    count: state.count + newAppointments.length,
                    results: [...state.results, ...newAppointments]
                };

            } else {
                return action.payload
            }
        }),
            builder.addCase(updateAppointments.fulfilled, (state, action) => {
                const updatedAppointment = action.payload

                const updatedResults = state.results.map(appointment => {
                    if (appointment.id === updatedAppointment.id) {

                        return {
                            ...updatedAppointment
                        }
                    }
                    return appointment;
                });

                return {
                    ...state,
                    results: [...updatedResults]
                }
            }),
            builder.addCase(deleteAppointment.fulfilled, (state, action) => {
                const newAppointments = state.results.filter(appointment => appointment.id !== action.payload)
                return {
                    ...state,
                    results: [...newAppointments]
                }
            }),
            builder.addCase(createAppointment.fulfilled, (state, action) => {
                if (Object.keys(state).length > 0) {
                    return {
                        ...state,
                        count: state.count + 1,
                        results: [...state.results, action.payload]
                    };

                } else {
                    return {
                        results: [action.payload]
                    }
                }
            })
    }
})

export const {
    clearAppointments,
    addNewAppointments
} = appointmentsSlice.actions

export default appointmentsSlice.reducer