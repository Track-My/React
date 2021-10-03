import { HOST } from '../config';
import { get, put } from '../lib/communication';
import { Device, DeviceResponce, DevicesResponce } from '../lib/types';

const fetchDevices = () => 
    get<DevicesResponce>(`${HOST}devices/`);

const editDevices = (device: Device) => 
    put<DeviceResponce>(`${HOST}devices/${device.id}/`, device);

const devicesService = {
    fetchDevices,
    editDevices,
};

export default devicesService;
