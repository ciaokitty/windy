import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React-Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ location, setLocation }) {
    const map = useMap();

    useEffect(() => {
        map.flyTo(location, map.getZoom());
    }, [location, map]);

    useMapEvents({
        click(e) {
            setLocation(e.latlng);
        },
    });

    return location === null ? null : (
        <Marker position={location}></Marker>
    );
}

function WorldMap({ location, setLocation }) {
    return (
        <MapContainer center={[51.505, -0.09]} zoom={3} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <LocationMarker location={location} setLocation={setLocation} />
        </MapContainer>
    );
}

export default WorldMap;
