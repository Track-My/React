import { HOST } from '../config';
import { get } from '../lib/communication';
import { FetchLocationRequest, LocationsResponce } from '../lib/types';

const fetchLocations = (request: FetchLocationRequest) =>  {
    return get<LocationsResponce>(
        `${HOST}locations/?deviceId=${request.deviceId}&date=${request.date.slice(0, 10)}&tz=${new Date().getTimezoneOffset()}`
    );
}

const fetchLocationsFromTime = (request: FetchLocationRequest) =>  {
    return get<LocationsResponce>(
        `${HOST}locations/?deviceId=${request.deviceId}&last=${request.date}`
    );
}

const locationsService = {
    fetchLocations,
    fetchLocationsFromTime,
};

export default locationsService;
