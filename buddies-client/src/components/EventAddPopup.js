import { useContext } from "react"

import { Popup } from "react-map-gl"
import { useNavigate } from "react-router-dom"

import { UserContext } from "../context/user-context"

export default function EventAddPopup({
  marker,
  setShowEventPinDropPopup,
  setIsOpen,
}) {
  const { isLoggedIn } = useContext(UserContext)
  const navigate = useNavigate()

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
              if (isLoggedIn) {
                setIsOpen(true)
                setShowEventPinDropPopup(false)
              } else {
                navigate("/login")
              }
            }}
          >
            YES
          </button>
          <button
            onClick={() => {
              setShowEventPinDropPopup(false)
            }}
            className="bg-red-400 px-2 py-1 text-white font-bold rounded"
          >
            DISMISS
          </button>
        </div>
      </div>
    </Popup>
  )
}
