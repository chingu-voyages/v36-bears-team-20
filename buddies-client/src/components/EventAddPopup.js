import { useContext } from "react";
import { Popup } from "react-map-gl";
import { UserContext } from "../context/user-context";
import { useNavigate } from "react-router-dom";

export default function EventAddPopup({
  marker,
  setShowEventPinDropPopup,
  setIsOpen,
}) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <Popup
      latitude={marker.latitude}
      longitude={marker.longitude}
      closeButton={false}
      closeOnClick={false}
      onClose={() => setShowEventPinDropPopup(false)}
      offsetTop={-20}
      offsetLeft={10}
      className="flex rounded-md z-20"
    >
      <div className="mt-3">
        <p className="font-bold">Confirm event location?</p>
        <div className="flex justify-around mt-3">
          <button
            className="bg-blue-400 px-2 py-1 text-white font-bold rounded"
            onClick={() => {
              if (user) {
                setIsOpen(true);
                setShowEventPinDropPopup(false);
              } else {
                navigate("/login");
              }
            }}
          >
            YES
          </button>
          <button
            onClick={() => {
              setShowEventPinDropPopup(false);
            }}
            className="bg-red-400 px-2 py-1 text-white font-bold rounded"
          >
            DISMISS
          </button>
        </div>
      </div>
    </Popup>
  );
}
