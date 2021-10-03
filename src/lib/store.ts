import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import sessionReducer from './reducers/sessionReducer';
import entitiesReducer from './reducers/entitiesReducer';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    entities: entitiesReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
