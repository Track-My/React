import { useEffect } from 'react';
import './App.css';
import Sidebar from './containers/sidebar/Sidebar';
import Map from './components/map/Map';
import {
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import PrivateRoute from './containers/route/PrivateRoute';
import { useAppDispatch, useAppSelector } from './lib/hooks';
import { fetchLocations, fetchLocationsFromTime } from './lib/reducers/entitiesReducer';
import AlertPanel from './containers/alertPanel/AlertPanel';
import Header from './containers/header/Header';
import AuthenticationContainer from './containers/account/authentication/AuthenticationContainer';
import RegistrationContainer from './containers/account/registration/RegistrationContainer';

function App() {

	const dispatch = useAppDispatch();

	const user = useAppSelector(state => state.session.user);
	const date = useAppSelector(state => state.entities.locations.date);
	const deviceId = useAppSelector(state => state.entities.devices.selectedId);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (deviceId) {
			dispatch(fetchLocations({ deviceId, date }));
			let time = new Date();
			interval = setInterval(() => {
				dispatch(fetchLocationsFromTime({ deviceId, date: time.toISOString() }))
				time = new Date();
			}, 60_000)
		}
		return () => {
			if (interval) {
				clearInterval(interval);
			}
		}
	}, [deviceId, date, dispatch]);

	return (
		<>
			<Switch>
				<Route path="/authentication/">
					{user && <Redirect to="/" />}
					<AuthenticationContainer />
				</Route>
				<Route path="/registration/">
					{user && <Redirect to="/" />}
					<RegistrationContainer />
				</Route>
				<PrivateRoute path="/">
					<Header />
					<div id="content">
						<Sidebar />
						<Map />
					</div>
				</PrivateRoute>
			</Switch>
			<AlertPanel />
		</>
	);
}

export default App;
