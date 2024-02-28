import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newRequest from "../../ultils/request";

const initialState = []

export const fetchMedicinesData = createAsyncThunk(
    'medicines/fetchMedicinesData',
    async ({ access_token, name, page }) => {
        try {
            const response = await newRequest.get(`/medicines/?name=${name}&page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            return response.data
        }
        catch (err) {
            console.log('Error from fetchMedicinesData: ', err)
        }
    }

)

export const getMedicineById = createAsyncThunk(
    'medicines/getMedicineById',
    async ({ access_token, id }) => {
        try {
            const response = await newRequest.get(`/medicines/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            return response.data
        }
        catch (err) {
            console.log('Error from getMedicineById: ', err)
        }
    }
)

export const updateMedicine = createAsyncThunk(
    'medicines/updateMedicine',
    async (data) => {
        try {

            const { access_token, medicineId, updateData } = data
            console.log('access_token ', access_token)
            console.log('medicineId ', medicineId)
            console.log('updateData ', updateData)

            const response = await newRequest.patch(`/medicines/${medicineId}/`, updateData, {
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-Type": 'multipart/form-data'
                }
            })
            console.log('UpdateMedicine response.data: ', response.data)
            return response.data
        }
        catch (err) {
            console.log('Error from updateMedicine: ', err)
        }
    }
)

export const deleteMedicine = createAsyncThunk(
    'medicines/deleteMedicine',
    async ({ access_token, medicineId }) => {
        try {
            const response = await newRequest.delete(`/medicines/${medicineId}/`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            console.log('response.data delete medicine: ', medicineId)
            return medicineId
        } catch (err) {
            console.log('Error from deleteMedicine: ', err)
        }
    }
)

export const createMedicine = createAsyncThunk(
    'medicines/createMedicine',
    async ({ access_token, data }) => {

        try {
            const response = await newRequest.post(`/medicines/`, data, {
                headers: {
                    "Content-Type": 'multipart/form-data',
                    'Authorization': `Bearer ${access_token}`
                }
            });
            console.log('response from createMedicine: ', response.data)
            return response.data
        } catch (err) {
            console.log('Error from createMedicine: ', err)
        }
    }
)

export const medicineSlice = createSlice({
    name: 'medicines',
    initialState,
    reducers: {
        clearMedicines: () => {
            return initialState
        },
        addNewMedicines: (state, action) => {
            const existingIds = state.results.map(medicine => medicine.id)
            const newMedicines = action.payload.results.filter(
                medicine => !existingIds.includes(medicine.id)
            )
            console.log('addnewmedicines: ', {
                ...state,
                results: [...state.results, ...newMedicines]
            })
            return {
                ...state,
                results: [...state.results, ...newMedicines]
            }
        },

    },
    extraReducers: (builder) => {
        builder.addCase(fetchMedicinesData.fulfilled, (state, action) => {
            if (Object.keys(state).length > 0) {
                const existingIds = state.results.map(medicine => medicine.id)
                const newMedicines = action.payload.results.filter(
                    medicine => !existingIds.includes(medicine.id))
                return {
                    ...state,
                    count: state.count + newMedicines.length,
                    results: [...state.results, ...newMedicines]
                };

            } else {
                return action.payload
            }
        }),
            builder.addCase(updateMedicine.fulfilled, (state, action) => {
                const updatedMedicine = action.payload
                console.log('update action.payload ', action)

                const updatedResults = state.results.map(medicine => {
                    console.log('md: ', medicine)
                    if (medicine.id === updatedMedicine.id) {

                        return {
                            ...updatedMedicine
                        }
                    }
                    return medicine;
                });

                return {
                    ...state,
                    results: [...updatedResults]
                }
            }),
            builder.addCase(deleteMedicine.fulfilled, (state, action) => {
                const newMedicines = state.results.filter(medicine => medicine.id !== action.payload)
                return {
                    ...state,
                    results: [...newMedicines]
                }
            }),
            builder.addCase(createMedicine.fulfilled, (state, action) => {
                return {
                    ...state,
                    results: [
                        ...state.results,
                        ...action.payload
                    ]
                }
            }),
            builder.addCase(getMedicineById.fulfilled, (state, action) => {
                if (Object.keys(state).length > 0) {
                    const newMedicine = state.results.find(
                        medicine => medicine.id !== action.payload.id)
                    if (newMedicine) {
                        
                        return {
                            ...state,
                            count: state.count + 1,
                            results: [...state.results, newMedicine]
                        };
                    }

                    return state
    
                } else {
                    return {
                        results: [action.payload]
                    }
                }
            })
    }
})

export const {
    clearMedicines,
    addNewMedicines
} = medicineSlice.actions

export default medicineSlice.reducer