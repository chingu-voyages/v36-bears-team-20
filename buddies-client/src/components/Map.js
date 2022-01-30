import { useState, useMemo, useRef, useCallback, useEffect } from "react";

import { ButtonBase } from "@mui/material";
import axios from "axios";
import MapGL, { GeolocateControl, Marker } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";

import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import AddEventForm from "./AddEventForm";
import EventAddPopup from "./EventAddPopup";
import EventMarkerPin from "./EventMarkerPin";
import EventPopup from "./EventPopup";
import MapHeader from "./MapHeader";

const geolocateControlStyle = {
  right: 10,
  top: 10,
};

export default function Map() {
  const [viewport, setViewPort] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 9,
  });

  const mapRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [eventMarkers, setEventMarkers] = useState([]);

  const [showPin, setShowPin] = useState(false);

  const [showPopup, togglePopup] = useState(false);
  const [showEventPinDropPopup, setShowEventPinDropPopup] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

  const handleViewportChange = useCallback(
    (newViewport) => setViewPort(newViewport),
    []
  );

  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [handleViewportChange]
  );
  const [marker, setMarker] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
  });

  // eslint-disable-next-line no-unused-vars
  const [events, logEvents] = useState({});

  const onMarkerDragStart = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragStart: event.lngLat }));
  }, []);

  const onMarkerDrag = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDrag: event.lngLat }));
    setShowEventPinDropPopup(false);
  }, []);

  const onMarkerDragEnd = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }));
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
    });
    setShowEventPinDropPopup(true);
  }, []);

  const handleDropPin = () => {
    setMarker({
      longitude: viewport.longitude,
      latitude: viewport.latitude,
    });
    setShowEventPinDropPopup(false);
    setShowPin(true);
    togglePopup(false);
  };

  useEffect(() => {
    axios
      .get(
        `${
          process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"
        }/api/events`
      )
      .then((response) => {
        setEventMarkers(response.data);
      });
  }, []);

  const markers = useMemo(
    () =>
      eventMarkers.map((event) => (
        <Marker
          key={event._id}
          longitude={event.location[1]}
          latitude={event.location[0]}
          offsetTop={-20}
          offsetLeft={-10}
          className="z-0 bg-blue-300 flex justify-center items-center px-2 py-2 rounded-full border-2 border-black"
          captureClick={false}
        >
          <ButtonBase
            disableRipple
            disableTouchRipple
            onClick={() => {
              setCurrentEventId(event._id);
              togglePopup(true);
            }}
          >
            <img
              src={`${event.activity}.png`}
              alt={event.activity}
              width="30px"
              height="30px"
              style={{ cursor: "pointer" }}
            />
          </ButtonBase>
        </Marker>
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eventMarkers]
  );

  return (
    <div
      className="relative flex flex-col justify-center items-center"
      style={{ height: "100vh" }}
    >
      {!isOpen && <MapHeader handleDropPin={handleDropPin} />}
      <AddEventForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        location={marker}
        setEventMarkers={setEventMarkers}
        setShowPin={setShowPin}
      />
      <MapGL
        ref={mapRef}
        {...viewport}
        onViewportChange={(viewport) => setViewPort(viewport)}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        width="100%"
        height="100%"
      >
        {!isOpen && (
          <EventMarkerPin
            marker={marker}
            onMarkerDrag={onMarkerDrag}
            onMarkerDragStart={onMarkerDragStart}
            onMarkerDragEnd={onMarkerDragEnd}
            showPin={showPin}
          />
        )}
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          position="top-left"
        />
        <GeolocateControl
          style={geolocateControlStyle}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          auto
        />
        {showPopup && (
          <EventPopup
            currentEventId={currentEventId}
            togglePopup={togglePopup}
          />
        )}
        {showEventPinDropPopup && (
          <EventAddPopup
            marker={marker}
            setShowEventPinDropPopup={setShowEventPinDropPopup}
            setIsOpen={setIsOpen}
          />
        )}
        {markers}
      </MapGL>
    </div>
  );
}
