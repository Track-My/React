import { useCallback, useEffect, useRef, useState } from 'react';
import './Sidebar.css';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { editDevice, selectDeviceById, setSelectedDeviceId, setSelectedLocationId } from '../../lib/reducers/entitiesReducer';
import DeviceList from '../deviceList/DeviceList';
import { Device } from '../../lib/types';

export default function Sidebar() {

	const dispatch = useAppDispatch();

	const locationsIds = useAppSelector(state => state.entities.locations.ids);
	const locationsEntities = useAppSelector(state => state.entities.locations.entities);
	const selectedLocationId = useAppSelector(state => state.entities.locations.selectedId);
	const trigger = useAppSelector(state => state.entities.locations.trigger);
	const selectedDeviceId = useAppSelector(state => state.entities.devices.selectedId);
	const device = useAppSelector(state => selectDeviceById(state.entities.devices, selectedDeviceId ?? -1));

	const ref = useRef<HTMLDivElement | null>(null);

	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState("");

	useEffect(() => {
		if (device) {
			setName(device.name);
		}
		setIsEditing(false);
	}, [device]);

	useEffect(() => {
		if (!isEditing && device) {
			setName(device.name);
		}
	}, [device, isEditing]);

	useEffect(() => {
		ref.current?.scrollIntoView({
			block: "center",
			behavior: "smooth"
		});
	}, [trigger]);


	const onSave = useCallback(
		() => {
			if (!device) return;
			const editedDevice: Device = {
				...device,
				name: name.trim(),
			};
			dispatch(editDevice(editedDevice));
		},
		[dispatch, device, name],
	)

	return (
		<div id="sidebar">
			{(selectedDeviceId === null) ? (
				<DeviceList />
			) : (
				<>
					<div id="toolbar">
						<b 
							tabIndex={0}
							className="button" 
							onClick={() => dispatch(setSelectedDeviceId(null))}
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									dispatch(setSelectedDeviceId(null));
								}
							}}
						>
							Devices
						</b>
						{device && (
							<div id="device-info">
								<div>Type:</div>
								<b>{device.type}</b>
								<div>Name:</div>
								{isEditing ? (
									<input 
										className="device-info-input"
										type="text" 
										value={name} 
										onChange={e => setName(e.target.value)}
									/>
								) : (
									<b>{device.name}</b>
								)}
								<div>UUID:</div>
								<b>{device.uuid}</b>
								<div id="device-info-controls">
									{isEditing ? (
										<>
											<div
												className="device-info-button"
												tabIndex={0}
												onClick={_ => setIsEditing(false)}
												onKeyPress={e => {
													if (e.key === 'Enter') {
														setIsEditing(false)
													}
												}}
											>
												Cancel
											</div>
											{name.trim() !== device.name && (
												<div
												className="device-info-button"
												tabIndex={0}
												onClick={_ => onSave()}
												onKeyPress={e => {
													if (e.key === 'Enter') {
														onSave()
													}
												}}
											>
												Save
											</div>
											)}
										</>
									): (
										<div
											className="device-info-button"
											tabIndex={0}
											onClick={_ => setIsEditing(true)}
											onKeyPress={e => {
												if (e.key === 'Enter') {
													setIsEditing(true)
												}
											}}
										>
											Edit
										</div>
									)}
								</div>
							</div>
						)}
					</div>
					<div className="block-coords-head">
							<div>Time</div>
							<div>Latitude</div>
							<div>Longitude</div>
						</div>
					<div id="locations-list">
						{
							[...locationsIds].reverse().map(locationId => {
								const location = locationsEntities[locationId];
								if (!location) return null;
								return (
									<div
										key={location.id}
										tabIndex={0}
										ref={r => {
											if (selectedLocationId === location.id) {
												ref.current = r
											}
										}}
										className={selectedLocationId === location.id ? "location-item-selected" : "location-item"}
										onClick={() => dispatch(setSelectedLocationId(location.id))}
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												dispatch(setSelectedLocationId(location.id));
											}
										}}
									>
										<div className="block-coords">
											<div>
												<b>{ new Date(location.time).toLocaleTimeString() }</b>
											</div>
											<div>{ +location.latitude.toFixed(5) }</div>
											<div>{ +location.longitude.toFixed(5) }</div>
										</div>
									</div>
								)
							})
						}
					</div>
				</>
			)}
		</div>
	);
}

