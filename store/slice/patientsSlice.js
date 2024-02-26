import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newRequest from "../../ultils/request";

const initialState = []

export const fetchPatientsData = createAsyncThunk(
    'patients/fetchPatientsData',
    async ({ access_token, name, page }) => {
        try {
            const response = await newRequest.get(`/patients/?name=${name}&page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            return response.data
        }
        catch (err) {
            console.log('Error from fetchPatientsData: ', err)
        }
    }

)

export const createPatient = createAsyncThunk(
    'patients/createPatient',
    async ({ data }) => {

        try {
            const response = await newRequest.post(`/patients/`, data, {
                headers: {
                    "Content-Type": 'multipart/form-data',
                }
            });
            console.log('response from createPatient: ', response.data)
            return response.data
        } catch (err) {
            console.log('Error from createPatient: ', err)
        }
    }
)

export const patientsSlice = createSlice({
    name: 'patients',
    initialState,
    reducers: {
        clearPatients: () => {
            return initialState
        },
        addNewPatients: (state, action) => {
            const existingIds = state.results.map(patient => patient.id)
            const newPatients = action.payload.filter(
                patient => !existingIds.includes(patient.id)
            )
            console.log('addnewpatients: ', {
                ...state,
                count: state.count + newPatients.length,
                results: [...state.results, ...newPatients]
            })
            return {
                ...state,
                count: state.count + newPatients.length,
                results: [...state.results, ...newPatients]
            }
        },
        addPatient: (state, action) => {
            if (Object.keys(state).length > 0) {
                const isPatientExists = state.results.some(patient => patient.id === action.payload.id)
                if (isPatientExists) {
                    return state;
                }

                return {
                    ...state,
                    count: state.count + 1,
                    results: [...state.results, action.payload]
                };

            } else {
                return {
                    ...state,
                    count: 1,
                    results: [action.payload]
                }
            }
            const existingIds = state.results.map(patient => patient.id)
            const newPatient = action.payload.find(
                patient => !existingIds.includes(patient.id)
            )
            console.log('addnewpatient: ', {
                ...state,
                count: state.count + 1,
                results: [...state.results, newPatient]
            })
            return {
                ...state,
                count: state.count + 1,
                results: [...state.results, newPatient]
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPatientsData.fulfilled, (state, action) => {
            if (Object.keys(state).length > 0) {
                const existingIds = state.results.map(patient => patient.id)
                const newPatients = action.payload.results.filter(
                    patient => !existingIds.includes(patient.id))
                return {
                    ...state,
                    count: state.count + newPatients.length,
                    results: [...state.results, ...newPatients]
                };

            } else {
                return action.payload
            }
        }),
            builder.addCase(createPatient.fulfilled, (state, action) => {
                // return action.payload
            })
    }
})

export const {
    clearPatients,
    addNewPatients, addPatient
} = patientsSlice.actions

export default patientsSlice.reducer