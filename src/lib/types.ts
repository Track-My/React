export interface Location {
	id: number;
    latitude: number;
    longitude: number;
    time: string;
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Credentials {
	email: string;
	password: string;
}

export interface Device {
    id: number;
    name: string;
    type: string;
    uuid: string;
}

export interface User {
    id: number;
	email: string;
}



export interface RegistrationRequest {
    email: string;
    password: string;
}

export interface AuthenticationRequest {
	credentials: Credentials;
    device: {
        name: string;
        type: string;
        uuid: string;
    };
}

export interface FetchLocationRequest {
    deviceId: number;
    date: string;
}

export interface RefreshRequest {
	refreshToken: string;
}

export interface AuthenticationResponse extends FetchResponse {
	user: User;
    device: Device;
    token: string;
    refreshToken: string;
}

export interface RefreshResponse extends FetchResponse {
    token: string;
    refreshToken: string;
}

export interface LocationsResponce extends FetchResponse {
	locations: Location[];
}

export interface DevicesResponce extends FetchResponse {
	devices: Device[];
}

export interface DeviceResponce extends FetchResponse {
	device: Device;
}

export interface FetchResponse {
    message?: string;
}
