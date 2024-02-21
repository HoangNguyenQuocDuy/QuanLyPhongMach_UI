import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import accountSlice from "./slice/accountSlice";
import doctorsSlice from "./slice/doctorsSlice";
import appSlice from "./slice/appSlice";
import nurseSlice from "./slice/nurseSlice";
import scheduleSlice from "./slice/scheduleSlice";

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    user: userSlice,
    account: accountSlice,
    doctors: doctorsSlice,
    nurses: nurseSlice,
    schedules: scheduleSlice,
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
