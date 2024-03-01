import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import accountSlice from "./slice/accountSlice";
import doctorsSlice from "./slice/doctorsSlice";
import appSlice from "./slice/appSlice";
import nurseSlice from "./slice/nurseSlice";
import scheduleSlice from "./slice/scheduleSlice";
import medicineSlice from "./slice/medicineSlice";
import patientsSlice from "./slice/patientsSlice";
import registerSlice from "./slice/registerSlice";
import appointmentsSlice from "./slice/appointmentsSlice";
import medicalHistoriesSlice from "./slice/medicalHistories";
import paymentsSlice from "./slice/paymentsSlice";

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    user: userSlice,
    account: accountSlice,
    doctors: doctorsSlice,
    nurses: nurseSlice,
    patients: patientsSlice,
    schedules: scheduleSlice,
    medicines: medicineSlice,
    register: registerSlice,
    appointments: appointmentsSlice,
    medicalHistories: medicalHistoriesSlice,
    payments: paymentsSlice,
    app: appSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
})

export const persistor = persistStore(store)
