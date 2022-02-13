import React, { useState, useEffect } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import createPersistedState from "use-persisted-state";

const UserContext = React.createContext(null);
const useToken = createPersistedState("token");
const useUser = createPersistedState("user");

function UserContextProvider(props) {
  const [hamburgerIsOpen, setHamburgerIsOpen] = useState(false);
  const [token, setToken] = useToken("");
  const [user, setUser] = useUser(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !user) {
      axios
        .post(
          `${
            process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"
          }/api/auth/verify`,
          { token }
        )
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          setToken("");
          toast.error("Please log in again");
          navigate("/login");
        });
    } else if (!token && user) {
      setUser(null);
    }
  }, [user, token, setUser, navigate, setToken]);

  const handleSignOut = () => {
    setToken("");
  };

  return (
    <UserContext.Provider
      value={{
        token,
        setToken,
        user,
        handleSignOut,
        hamburgerIsOpen,
        setHamburgerIsOpen,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export { UserContext, UserContextProvider };
