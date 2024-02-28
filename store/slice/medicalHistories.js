import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newRequest from "../../ultils/request";

const initialState = []

export const fetchMedicalHistories = createAsyncThunk(
    'medicalHistories/fetchMedicalHistories',
    async ({ access_token, start_date, end_date, page, p_id }) => {
        try {
            const response = await newRequest.get(`/medicalHistories/?p_id=${p_id}&start_date=${start_date}&end_date=${end_date}&page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            return response.data
        }
        catch (err) {
            console.log('Error from fetchMedicalHistories: ', err)
        }
    }

)

export const medicalHistoriesSlice = createSlice({
    name: 'medicalHistories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchMedicalHistories.fulfilled, (state, action) => {
            if (Object.keys(state).length > 0) {
                const existingIds = state.results.map(medicalHistory => medicalHistory.id)
                const newMedicalHistories = action.payload.results.filter(
                    medicalHistory => !existingIds.includes(medicalHistory.id))
                return {
                    ...state,
                    results: [...state.results, ...newMedicalHistories]
                };

            } else {
                return action.payload
            }
        })
    }
})

export const {} = medicalHistoriesSlice.actions

export default medicalHistoriesSlice.reducer