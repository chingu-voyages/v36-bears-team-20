import React, { useContext, useEffect, useState } from "react";

import axios from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import { UserContext } from "../context/user-context";
import ProfileBgImg from "../images/profile-bg.png";

function Profile() {
  const { user, token, setToken } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  if (!user) {
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
            {profile && (
              <form className="loginBox m-6">
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  id="loginInput"
                  defaultValue={profile.username}
                />

                <input
                  placeholder="Email"
                  type="email"
                  required
                  className="loginInput"
                  defaultValue={profile.email}
                />

                <input
                  placeholder="Password"
                  type="password"
                  required
                  minLength="6"
                  className="loginInput"
                />
                <button className="loginButton" type="submit">
                  Save
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
