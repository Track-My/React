import { createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import locationsService from '../../services/locations.service';
import { Coordinates, Device, FetchLocationRequest, Location } from '../types';
import { ZOOM } from '../../config';
import devicesService from '../../services/devices.service';

const locationsAdapter = createEntityAdapter<Location>({
    selectId: (location) => location.id,
});

const devicesAdapter = createEntityAdapter<Device>({
    selectId: (device) => device.id,
});

type LocationEntities = ReturnType<typeof locationsAdapter.getInitialState>;
type DeviceEntities = ReturnType<typeof devicesAdapter.getInitialState>;

export interface Entities {
    locations: { 
        date: string;
        center: Coordinates;
        selectedId: number | null;
        zoom: number;
        trigger: boolean;
    } & LocationEntities,
    devices: {
        isOpen: boolean;
        selectedId: number | null;
    } & DeviceEntities,
};

const initialState: Entities = {
    locations: locationsAdapter.getInitialState({ 
        date: new Date().toString(),
        center: { lat: 52.225, lng: 20.99 },
        selectedId: null,
        zoom: ZOOM,
        trigger: false,
    }),
    devices: devicesAdapter.getInitialState({
        isOpen: true,
        selectedId: null,
    }),
};

export const fetchLocations = createAsyncThunk(
    'entities/fetchLocations',
    async (request: FetchLocationRequest) => {
        const response = await locationsService.fetchLocations(request);
        return response.locations;
    }
);

export const fetchLocationsFromTime = createAsyncThunk(
    'entities/fetchLocationsFromTime',
    async (request: FetchLocationRequest) => {
        const response = await locationsService.fetchLocationsFromTime(request);
        return response.locations;
    }
);

export const fetchDevices = createAsyncThunk(
    'entities/fetchDevices',
    async () => {
        const response = await devicesService.fetchDevices();
        return response.devices;
    }
);

export const editDevice = createAsyncThunk(
    'entities/editDevice',
    async (device: Device) => {
        const response = await devicesService.editDevices(device);
        return response.device;
    }
);

export const entitiesSlice = createSlice({
    name: "entities",
    initialState,
    reducers: {
        setDate: (state, action: PayloadAction<string>) => {
            state.locations.date = action.payload;
        },
        setCenter: (state, action: PayloadAction<Coordinates>) => {
            state.locations.center = action.payload;
        },
        setZoom: (state, action: PayloadAction<number>) => {
            state.locations.zoom = action.payload;
        },
        setSelectedLocationId: (state, action: PayloadAction<number>) => {
            if (action.payload === state.locations.selectedId) {
                state.locations.selectedId = null;
            } else {
                state.locations.selectedId = action.payload;
                const locations = state.locations.entities[action.payload]!
                state.locations.center = {
                    lat: locations.latitude,
                    lng: locations.longitude
                };
            }
        },
        triggerScrollIntoView: (state) => {
            state.locations.trigger = !state.locations.trigger;
        },
        setSelectedDeviceId: (state, action: PayloadAction<number | null>) => {
            state.devices.selectedId = action.payload;
            state.devices.isOpen = false;
            state.locations.selectedId = null;
            locationsAdapter.removeAll(state.locations);
        },
        clearEntities: (state) => {
            state.locations.selectedId = null;
            locationsAdapter.removeAll(state.locations);
            state.devices.selectedId = null;
            devicesAdapter.removeAll(state.devices);
            state.devices.isOpen = true;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchLocations.fulfilled, (state, action: PayloadAction<Location[]>) => {
            const locations = action.payload;
            locationsAdapter.setAll(state.locations, locations);
            state.locations.selectedId = null;
            if (locations.length > 0) {
                const lat = {
                    max: locations.reduce((p, v) => p.latitude > v.latitude ? p : v).latitude,
                    min: locations.reduce((p, v) => p.latitude < v.latitude ? p : v).latitude
                }
                const lng = {
                    max: locations.reduce((p, v) => p.longitude > v.longitude ? p : v).longitude,
                    min: locations.reduce((p, v) => p.longitude < v.longitude ? p : v).longitude
                }
                state.locations.center = {
                    lat: (lat.max + lat.min) / 2,
                    lng: (lng.max + lng.min) / 2
                };
                state.locations.zoom = ZOOM;
            }
        })
        .addCase(fetchLocationsFromTime.fulfilled, (state, action: PayloadAction<Location[]>) => {
            locationsAdapter.addMany(state.locations, action.payload);
        })
        .addCase(fetchDevices.fulfilled, (state, action: PayloadAction<Device[]>) => {
            devicesAdapter.setAll(state.devices, action.payload);
        })
        .addCase(editDevice.fulfilled, (state, action: PayloadAction<Device>) => {
            devicesAdapter.upsertOne(state.devices, action.payload)
        })
    },
});

export const {
    setDate,
    setCenter,
    setZoom,
    setSelectedLocationId,
    triggerScrollIntoView,
    setSelectedDeviceId,
    clearEntities,
} = entitiesSlice.actions;

export const {
    selectAll: selectAllDevices,
    selectById: selectDeviceById,
} = devicesAdapter.getSelectors();

export default entitiesSlice.reducer;
