import { configureStore } from "@reduxjs/toolkit";
import genomicsReducer from '../features/genomics/genomicsSlice';

export const store = configureStore({
    reducer:{
        genomics: genomicsReducer
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;