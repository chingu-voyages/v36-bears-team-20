import {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
  useContext,
} from "react";

import { ButtonBase } from "@mui/material";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import MapGL, { GeolocateControl, Marker } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import { toast } from "react-toastify";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker";

import { UserContext } from "../context/user-context";
import AddEventForm from "./AddEventForm";
import EventAddPopup from "./EventAddPopup";
import EventMarkerPin from "./EventMarkerPin";
import EventPopup from "./EventPopup";
import MapHeader from "./MapHeader";

import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.workerClass = MapboxWorker;

const geolocateControlStyle = {
  right: 10,
  top: 10,
};

export default function Map({ socket }) {
  const { setHamburgerIsOpen } = useContext(UserContext);

  const [viewport, setViewPort] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 9,
  });

  const mapRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [eventMarkers, setEventMarkers] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);

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

  useEffect(() => {
    if (socket) {
      const listener = (data) => {
        toast.info("You have a new message!", { toastId: "new_message" });

        setUnreadMessages((state) => state + 1);
      };

      socket.on("receiveMessage", listener);

      return () => socket.off("receiveMessage", listener);
    }
  }, [socket]);

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
      {/* Place MapHeader outside MapGL DOM tree to prevent mouse clicks from propagating to MapGL */}
      {!isOpen && (
        <MapHeader
          handleDropPin={handleDropPin}
          unreadMessages={unreadMessages}
        />
      )}
      <MapGL
        ref={mapRef}
        {...viewport}
        onViewportChange={(viewport) => setViewPort(viewport)}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        width="100%"
        height="100%"
        onMouseDown={() => {
          setHamburgerIsOpen(false);
        }}
      >
        <AddEventForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          location={marker}
          setEventMarkers={setEventMarkers}
          setShowPin={setShowPin}
        />
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
