import createPersistedState from 'use-persisted-state';
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const UserContext = React.createContext(null);
const useToken = createPersistedState('token');
const useUser = createPersistedState('user');

function UserContextProvider(props) {
  const [token, setToken] = useToken("");
  const [user, setUser] = useUser(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !user) {
      axios
        .post("http://localhost:8000/api/auth/verify", { token })
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
  }, [user, token]);

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
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export { UserContext, UserContextProvider };
