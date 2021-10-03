import { HOST } from '../config';
import { get } from '../lib/communication';
import { FetchLocationRequest, LocationsResponce } from '../lib/types';

const fetchLocations = (request: FetchLocationRequest) =>  {
    const date = new Date(request.date);
    const offset = date.getTimezoneOffset();
    const formattedDate = new Date(date.getTime() - (offset*60*1000));
    return get<LocationsResponce>(
        `${HOST}locations/?deviceId=${request.deviceId}&date=${formattedDate.toISOString().slice(0, 10)}&tz=${offset}`
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
