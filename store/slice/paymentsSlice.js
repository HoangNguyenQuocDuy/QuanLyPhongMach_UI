import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newRequest from "../../ultils/request";

const initialState = []

export const fetchPayments = createAsyncThunk(
    'payments/fetchPayments',
    async ({ access_token, date, page }) => {
        try {
            const response = await newRequest.get(`/payments/?date=${date}&page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            return response.data
        }
        catch (err) {
            console.log('Error from fetchPayments: ', err)
        }
    }

)

export const updatePayment = createAsyncThunk(
    'payments/updatePayment',
    async ({ access_token, data, id }) => {
        console.log('access_token ',access_token )
        console.log('data ', data)
        console.log('id ', id)
        try {
            const response = await newRequest.patch(`/payments/${id}/`, data, {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            })
            return response.data
        }
        catch (err) {
            console.log('Error from updatePayment: ', err)
        }
    }

)

export const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPayments.fulfilled, (state, action) => {
            if (Object.keys(state).length > 0) {
                const existingIds = state.results.map(payment => payment.id)
                const newPayments = action.payload.results.filter(
                    payment => !existingIds.includes(payment.id))
                return {
                    ...state,
                    results: [...state.results, ...newPayments]
                };

            } else {
                return action.payload
            }
        }),
        builder.addCase(updatePayment.fulfilled, (state, action) => {
            const updatedPayment = action.payload
                console.log('update action.payload ', action.payload)

                const updatedResults = state.results.map(payment => {
                    console.log('md: ', payment)
                    if (payment.id === updatedPayment.id) {

                        return {
                            ...updatedPayment
                        }
                    }
                    return payment;
                });

                return {
                    ...state,
                    results: [...updatedResults]
                }
        })
    }
})

export const {} = paymentsSlice.actions

export default paymentsSlice.reducer