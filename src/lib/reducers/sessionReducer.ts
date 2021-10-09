import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Device, AuthenticationRequest, AuthenticationResponse, RegistrationRequest } from '../types';
import usersService from '../../services/users.service';
import { ALERT_TIME } from '../../config';

export interface SessionError {
    id: number;
    message: string;
}

export interface Session {
    user: User | null;
    device: Device | null;
    errors: SessionError[];
}

const data = localStorage.getItem('data');

const initialState: Session = data ? {
    ...JSON.parse(data),
    errors: []
} : {
    user: null,
    device: null,
    errors: []
};

export const authenticate = createAsyncThunk(
    'session/authenticate',
    async (request: AuthenticationRequest, { dispatch }) => {
        try {
            const response = await usersService.authenticate(request);
            localStorage.setItem('data', JSON.stringify(response));
            return response;
        } catch (e) {
            const error = e as Error;
            dispatch(showError(error.message));
            throw error;
        }
    }
);

export const register = createAsyncThunk(
    'session/register',
    async (request: RegistrationRequest, { dispatch }) => {
        try {
            const response = await usersService.register(request);
            return response;
        } catch (e) {
            const error = e as Error;
            dispatch(showError(error.message));
            throw error;
        }
    }
);

export const showError = createAsyncThunk(
    'session/showError',
    async (message: string, { dispatch }) => {
        const error = { message, id: new Date().getTime() } as SessionError;
        dispatch(addError(error));
        await new Promise(r => setTimeout(r, ALERT_TIME));
        dispatch(removeError(error));
    }
);

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        logout: (state)  => {
            state.user = null;
            state.device = null;
        },
        addError: (state, action: PayloadAction<SessionError>) => {
            state.errors.push(action.payload);
        },
        removeError: (state, action: PayloadAction<SessionError>) => {
            const index = state.errors.findIndex(e => e.id === action.payload.id);
            if (index >= 0) {
                state.errors.splice(index, 1);
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(authenticate.fulfilled, (state, action: PayloadAction<AuthenticationResponse>) => {
            state.user = action.payload.user;
            state.device = action.payload.device;
        })
    }
});

export const { logout, addError, removeError } = sessionSlice.actions;

export default sessionSlice.reducer;
