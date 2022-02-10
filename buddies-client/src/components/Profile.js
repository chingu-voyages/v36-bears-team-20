import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

import axios from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import { UserContext } from "../context/user-context";
import ProfileBgImg from "../images/profile-bg.png";

function Profile() {
  const { user, token, setToken, handleSignOut } = useContext(UserContext);
  const [profile, setProfile] = useState({});

  const username = useRef();
  const email = useRef();
  const password = useRef();

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const form = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value || undefined,
      };

      axios
        .put(`http://localhost:8000/api/users/${user._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          toast.success("Profile updated successfully. Please relogin.", {
            toastId: "profile_update",
          });
          handleSignOut();
        })
        .catch(({ response }) => {
          let message = "";

          switch (response.status) {
            case 400:
              message =
                "Submitted data is invalid. Please check your inputs and try again.";
              break;

            case 401:
              message = "Invalid session. Please relogin and try again.";
              setToken("");
              navigate("/login");
              break;

            case 403:
              message = "Action not allowed. Please try again.";
              break;

            default:
              message = "Unknown error occurred.";
          }

          toast.error(message);
        });
    },
    [user, token, handleSignOut, navigate, setToken]
  );

  useEffect(() => {
    if (token && user) {
      axios
        .get(`http://localhost:8000/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setProfile(response.data);
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

          toast.error(message);
        });
    }
  }, [user, token, navigate, setToken]);

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return (
    <div className="">
      <Navbar />
      <div className="profile">
        <div className="flex flex-col md:flex-row w-full">
          <img
            src={ProfileBgImg}
            alt="profile-bg"
            className="hidden md:flex md:w-1/3 md:h-full md:object-cover"
          />
          <div className="flex flex-col justify-center items-center w-full">
            <h3 className="font-bold text-lg">Edit Profile</h3>
            <form className="loginBox m-6" onSubmit={handleSubmit}>
              <input
                name="username"
                type="text"
                placeholder="Username"
                id="loginInput"
                defaultValue={profile.username}
                ref={username}
                required
              />

              <input
                placeholder="Email"
                type="email"
                className="loginInput"
                defaultValue={profile.email}
                ref={email}
                required
              />

              <input
                placeholder="Password"
                type="password"
                minLength="6"
                className="loginInput"
                ref={password}
              />
              <button className="loginButton" type="submit">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
