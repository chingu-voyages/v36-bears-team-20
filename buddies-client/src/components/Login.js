import { useRef, useContext } from "react";

import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Footer from "../components/Footer";
import { UserContext } from "../context/user-context";
import HikingImg from "../images/hikingImg.jpg";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const { user, setToken } = useContext(UserContext);

  const handleLogin = (event) => {
    event.preventDefault();
    axios
      .post(
        `${
          process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"
        }/api/auth/login`,
        {
          email: email.current.value,
          password: password.current.value,
        }
      )
      .then((response) => {
        setToken(response.data.token);
        navigate("/map");
      })
      .catch((error) => {
        toast.error("Wrong credentials", {
          toastId: "wrong_credentials",
        });
      });
  };

  if (user) {
    return <Navigate to="/map" />;
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-center h-screen">
      <div className="w-1/2 h-full hidden md:flex overflow-x-hidden items-center justify-center">
        <img
          src={HikingImg}
          alt="hiking"
          className="h-full max-w-none w-auto"
        />
      </div>
      <div className="flex flex-col justify-center items-center w-1/2 h-full">
        <div className="mt-auto flex flex-col justify-center items-center">
          <h3 className="loginTitle">Hello Again!</h3>
          <p className="loginText">Welcome Back</p>
          <form className="w-full md:w-2/3" onSubmit={handleLogin}>
            <input
              placeholder="Email"
              type="email"
              required
              className="w-full bg-gray-200 px-4 py-2 rounded mt-2"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="w-full bg-gray-200 px-4 py-2 rounded mt-2"
              ref={password}
            />
            <button
              className="w-full bg-yellow-400 text-white font-bold px-4 py-2 rounded mt-4"
              type="submit"
            >
              Log in
            </button>
          </form>

          <span className="span-0">Don't have an account?</span>
          <Link style={{ textDecoration: "none" }} to="/register">
            <span className="span-1">Register</span>
          </Link>
        </div>
        <Footer />
      </div>
    </div>
  );
}
