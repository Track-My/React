import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchDevices, selectAllDevices, setSelectedDeviceId } from '../../lib/reducers/entitiesReducer';
import './DeviceList.css';

export default function DeviceList() {

    const dispatch = useAppDispatch();

    const devices = useAppSelector(state => selectAllDevices(state.entities.devices));

    useEffect(() => {
        dispatch(fetchDevices());
    }, [dispatch])

    return (
        <div id="deviceList">
            <h2>My devices</h2>
            {devices.map(device => (
                <div
                    key={device.id} 
                    className="deviceItem"
                    tabIndex={0}
                    onClick={() => dispatch(setSelectedDeviceId(device.id))}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            dispatch(setSelectedDeviceId(device.id));
                        }
                    }}
                >
                        <div>{device.type}</div>
                        <div>{device.name}</div>
                        <div>{device.uuid}</div>
                </div>
            ))}
        </div>
    );
}