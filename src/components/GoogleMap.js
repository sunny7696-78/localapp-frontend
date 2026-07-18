import React, { useEffect, useRef, useState } from 'react';

const DORAHA_CENTER = { lat: 30.7971, lng: 75.9346 };

const loadGoogleMaps = (apiKey) => {
  return new Promise((resolve) => {
    if (window.google && window.google.maps) { resolve(window.google.maps); return; }
    if (document.getElementById('google-maps-script')) {
      const interval = setInterval(() => {
        if (window.google && window.google.maps) { clearInterval(interval); resolve(window.google.maps); }
      }, 100);
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => resolve(window.google.maps);
    document.head.appendChild(script);
  });
};

export const LocationPickerMap = ({ onPickupSelect, onDropSelect, pickup, drop }) => {
  const mapRef = useRef(null);
  const [selecting, setSelecting] = useState('pickup');
  const [loaded, setLoaded] = useState(false);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;
  const mapInstance = useRef(null);
  const pickupMarker = useRef(null);
  const dropMarker = useRef(null);

  useEffect(() => {
    loadGoogleMaps(apiKey).then((maps) => {
      if (!mapRef.current) return;
      const map = new maps.Map(mapRef.current, { center: DORAHA_CENTER, zoom: 14, mapTypeControl: false, streetViewControl: false, fullscreenControl: false });
      mapInstance.current = map;
      setLoaded(true);
      map.addListener('click', (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const geocoder = new maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          const address = status === 'OK' && results[0] ? results[0].formatted_address : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          if (selecting === 'pickup') {
            if (pickupMarker.current) pickupMarker.current.setMap(null);
            pickupMarker.current = new maps.Marker({ position: { lat, lng }, map, icon: { url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }, animation: maps.Animation.DROP });
            if (onPickupSelect) onPickupSelect({ lat, lng, address });
            setSelecting('drop');
          } else {
            if (dropMarker.current) dropMarker.current.setMap(null);
            dropMarker.current = new maps.Marker({ position: { lat, lng }, map, icon: { url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' }, animation: maps.Animation.DROP });
            if (onDropSelect) onDropSelect({ lat, lng, address });
          }
        });
      });
    });
  }, [apiKey]);

  return (
    <div>
      <div style={{ background: selecting === 'pickup' ? 'var(--green)' : 'var(--red)', color: 'white', padding: '8px 16px', borderRadius: '8px 8px 0 0', fontWeight: 700, fontSize: '0.88rem', textAlign: 'center' }}>
        {selecting === 'pickup' ? 'Map pe click karo — PICKUP jagah' : 'Map pe click karo — DROP jagah'}
      </div>
      <div ref={mapRef} style={{ width: '100%', height: 300, borderRadius: '0 0 12px 12px' }} />
      {!loaded && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}><div className="spinner" /></div>}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <div onClick={() => setSelecting('pickup')} style={{ flex: 1, padding: 8, border: '2px solid ' + (selecting === 'pickup' ? 'var(--green)' : 'var(--border)'), borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center', background: selecting === 'pickup' ? '#dcfce7' : 'white' }}>
          {pickup?.address ? pickup.address.slice(0, 25) + '...' : 'Pickup select karo'}
        </div>
        <div onClick={() => setSelecting('drop')} style={{ flex: 1, padding: 8, border: '2px solid ' + (selecting === 'drop' ? 'var(--red)' : 'var(--border)'), borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center', background: selecting === 'drop' ? '#fee2e2' : 'white' }}>
          {drop?.address ? drop.address.slice(0, 25) + '...' : 'Drop select karo'}
        </div>
      </div>
    </div>
  );
};

export const LiveTrackingMap = ({ driverLocation, pickupLocation, dropLocation }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const driverMarker = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;

  useEffect(() => {
    loadGoogleMaps(apiKey).then((maps) => {
      if (!mapRef.current) return;
      const center = driverLocation || pickupLocation || DORAHA_CENTER;
      const map = new maps.Map(mapRef.current, { center, zoom: 15, mapTypeControl: false, streetViewControl: false, fullscreenControl: false });
      mapInstance.current = map;
      setLoaded(true);
      if (pickupLocation) new maps.Marker({ position: pickupLocation, map, icon: { url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }, title: 'Pickup' });
      if (dropLocation) new maps.Marker({ position: dropLocation, map, icon: { url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' }, title: 'Drop' });
      if (driverLocation) {
        driverMarker.current = new maps.Marker({ position: driverLocation, map, title: 'Driver', animation: maps.Animation.BOUNCE });
      }
      if (pickupLocation && dropLocation) {
        const ds = new maps.DirectionsService();
        const dr = new maps.DirectionsRenderer({ map, suppressMarkers: true, polylineOptions: { strokeColor: '#FF6B00', strokeWeight: 4 } });
        ds.route({ origin: pickupLocation, destination: dropLocation, travelMode: maps.TravelMode.DRIVING }, (result, status) => {
          if (status === 'OK') dr.setDirections(result);
        });
      }
    });
  }, [apiKey]);

  useEffect(() => {
    if (driverMarker.current && driverLocation && mapInstance.current) {
      driverMarker.current.setPosition(driverLocation);
      mapInstance.current.panTo(driverLocation);
    }
  }, [driverLocation]);

  return (
    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
      <div ref={mapRef} style={{ width: '100%', height: 280 }} />
      {!loaded && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}><div className="spinner" /></div>}
    </div>
  );
};

export default LocationPickerMap;
