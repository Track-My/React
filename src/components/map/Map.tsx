import { useEffect, useMemo, useState } from 'react';
import GoogleMapReact, { Maps } from 'google-map-react';
import Marker from '../marker/Marker';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { setCenter, setSelectedLocationId, setZoom, triggerScrollIntoView } from '../../lib/reducers/entitiesReducer';


export default function Map() {

	const dispatch = useAppDispatch();

	const selectedId = useAppSelector(state => state.entities.locations.selectedId);
	const zoom = useAppSelector(state => state.entities.locations.zoom);
	const center = useAppSelector(state => state.entities.locations.center);

    const locationsIds = useAppSelector(state => state.entities.locations.ids);
    const locationsEntities = useAppSelector(state => state.entities.locations.entities);

    const markers = useMemo(() => {
        const arr = locationsIds.map(locationId => locationsEntities[locationId]!);
        if (selectedId) {
            const selectedLocation = locationsEntities[selectedId]!;
            arr.push(selectedLocation);
        };
        return arr;
    }, [locationsIds, locationsEntities, selectedId]);

    const [positions, setPosition] = useState<GeolocationPosition | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setPosition(position);
            }, 
            (error) => {
                console.error(error);
            });
    }, [])

	return (
        <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyBjHKfwnCzctioNUv4Tv61OSMQfCpK1EgI" }}
            options={options}
            center={center}
            zoom={zoom}
            onChange={e => {
                dispatch(setCenter(e.center));
                dispatch(setZoom(e.zoom));
            }}
        >
            {
                markers.map((location, index) => (
                    <Marker
                        key={index}
                        lat={location.latitude}
                        lng={location.longitude}
                        date={location.time}
                        selected={selectedId === location.id}
                        onSelect={() => {
                            dispatch(setSelectedLocationId(location.id));
                            dispatch(triggerScrollIntoView());
                        }}
                    />
                ))
            }

            {
                positions && (
                    <MyPostionMarker 
                        lat={positions.coords.latitude}
                        lng={positions.coords.longitude}
                    />
                )
            }
        </GoogleMapReact>
	);
}

interface MyPostionMarkerProps {
	lat: number;
	lng: number;
}

function MyPostionMarker(_: MyPostionMarkerProps){
    return (
        <div className="marker-block">
            <div
                tabIndex={0}
                className='marker'
            >
            </div>
            <div className="marker-label">
                You
            </div>
        </div>
    );
}

const options = (maps: Maps) => ({
    streetViewControl: false,
    scaleControl: true,
    fullscreenControl: false,
    styles: [{
        featureType: "poi.business",
        elementType: "labels",
        stylers: [{
            visibility: "off"
        }]
    }],
    gestureHandling: "greedy",
    disableDoubleClickZoom: true,
    mapTypeControl: true,
    mapTypeId: maps.MapTypeId.SATELLITE,
    mapTypeControlOptions: {
        style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: maps.ControlPosition.BOTTOM_CENTER,
        mapTypeIds: [
            maps.MapTypeId.ROADMAP,
            maps.MapTypeId.SATELLITE,
            maps.MapTypeId.HYBRID
        ]
    },
    zoomControl: true,
    clickableIcons: false,
});
