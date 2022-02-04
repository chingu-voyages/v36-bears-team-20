import { useState, useEffect, useContext } from "react";

import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import PeopleIcon from "@mui/icons-material/People";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import moment from "moment";
import { Popup } from "react-map-gl";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { UserContext } from "../context/user-context";
import TalkImg from "../images/talk.png";

export default function EventPopup({ currentEventId, togglePopup }) {
  const [eventOwner, setEventOwner] = useState(null);
  const { user, token, setToken } = useContext(UserContext);
  const [eventData, setEventData] = useState(null);
  const navigate = useNavigate();

  const getEventOwner = (event) => {
    axios
      .get(
        `${
          process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"
        }/api/users/${event.userId}`
      )
      .then((response) => {
        setEventOwner(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getEventData = () => {
    axios
      .get(
        `${
          process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"
        }/api/events/${currentEventId}`
      )
      .then((response) => {
        setEventData(response.data);
        getEventOwner(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleJoinEvent = () => {
    if (token) {
      axios
        .put(
          `http://localhost:8000/api/events/join/${currentEventId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          setEventData(response.data);
          toast.dismiss();
          toast.clearWaitingQueue();
          toast.success("You joined the event!", {
            toastId: "event_join",
          });
        })
        .catch(({ response }) => {
          let message = "";

          switch (response.status) {
            case 401:
              message = "Invalid session. Please relogin and try again.";
              setToken("");
              navigate("/login");
              break;

            default:
              message = "Unknown error occurred.";
          }

          toast.error(message, {
            toastId: "event_join_error",
          });
        });
    } else {
      navigate("/login");
    }
  };

  const handleLeaveEvent = () => {
    axios
      .put(
        `http://localhost:8000/api/events/leave/${currentEventId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setEventData(response.data);
        toast.dismiss();
        toast.clearWaitingQueue();
        toast.success("You left the event!", {
          toastId: "event_left",
        });
      })
      .catch(({ response }) => {
        let message = "";

        switch (response.status) {
          case 401:
            message = "Invalid session. Please relogin and try again.";
            setToken("");
            navigate("/login");
            break;

          default:
            message = "Unknown error occurred.";
        }

        toast.error(message, {
          toastId: "event_left_error",
        });
      });
  };

  useEffect(() => {
    getEventData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {eventData && (
        <Popup
          latitude={eventData.location[0]}
          longitude={eventData.location[1]}
          closeButton={false}
          closeOnClick={true}
          onClose={() => togglePopup(false)}
          offsetTop={-20}
          offsetLeft={10}
          className="flex rounded-md z-10"
        >
          <div className="w-300" style={{ width: "200px" }}>
            <div className="flex justify-around">
              <div className="w-1/4 flex flex-col justify-center items-center">
                <img
                  src={TalkImg}
                  alt="talk"
                  className="w-10 h-10 rounded-full border-blue-400 border-2"
                />
                {eventOwner && (
                  <p className="text-sm text-center mt-1 font-bold capitalize">
                    {eventOwner.username}
                  </p>
                )}
              </div>
              <div className="w-3/4">
                <p className="font-bold text-lg text-center capitalize">
                  {eventData.name}
                </p>
              </div>
            </div>
            <hr className="mt-1 border-solid border-black"></hr>
            <div className="mt-1 text-center">
              <p>{moment(eventData.date).format("DD-MMM-YYYY h:mm A")}</p>
              <p>{eventData.activity}</p>
            </div>
            <div className="flex justify-between text-2xl text-blue-500 mt-1">
              <IconButton aria-label="guests">
                <Badge badgeContent={eventData.guests.length} color="secondary">
                  <PeopleIcon />
                </Badge>
              </IconButton>
              {user ? (
                <>
                  {eventData.guests.includes(user._id) ? (
                    <button
                      className="bg-red-500 text-white text-sm rounded font-bold px-3 py-1"
                      onClick={handleLeaveEvent}
                    >
                      Leave
                    </button>
                  ) : (
                    <button
                      className="bg-blue-500 text-white text-sm rounded font-bold px-3 py-1"
                      onClick={handleJoinEvent}
                    >
                      Join
                    </button>
                  )}
                </>
              ) : (
                <button
                  className="bg-blue-500 text-white text-sm rounded font-bold px-3 py-1"
                  onClick={handleJoinEvent}
                >
                  Join
                </button>
              )}
              <IconButton
                aria-label="chat"
                onClick={() => {
                  console.log("show chat");
                }}
              >
                <Badge badgeContent={0} color="info">
                  <ChatBubbleIcon />
                </Badge>
              </IconButton>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}
