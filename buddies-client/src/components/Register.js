import React, { useContext, useState } from "react";

import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Link, Navigate } from "react-router-dom";
import * as Yup from "yup";

import Footer from "../components/Footer";
import { UserContext } from "../context/user-context";
import RegisterImg from "../images/registerImg.jpg";

function Register() {
  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const { user } = useContext(UserContext);

  const validationSchema = () => {
    return Yup.object().shape({
      username: Yup.string()
        .required("Name is required")
        .min(4, "Username must be at least 4 characters")
        .max(20, "Username must not exceed 20 characters"),
      email: Yup.string()
        .required("Email is required")
        .email("Email is invalid"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(40, "Password must not exceed 40 characters"),
    });
  };
  const [serverState, setServerState] = useState();
  const handleServerResponse = (ok, msg) => {
    setServerState({ ok, msg });
  };
  const handleSubmit = (values, actions) => {
    axios
      .post(
        `${
          process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"
        }/api/auth/register`,
        values
      )
      .then((response) => {
        actions.setSubmitting(false);
        actions.resetForm();
        handleServerResponse(true, "Registration Successful!");
      })
      .catch((error) => {
        let msg;

        switch (error.response.status) {
          case 400:
            msg =
              "Submitted data is invalid. Please check your inputs and try again.";
            break;

          case 409:
            msg = "A user with the same username and/or email already exists.";
            break;

          default:
            msg = "Unknown error occurred. Please try again later.";
        }

        actions.setSubmitting(false);
        handleServerResponse(false, msg);
      });
  };

  if (user) {
    return <Navigate to="/profile" />;
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-center h-screen">
      <div className="w-1/2 h-full hidden md:flex overflow-x-hidden items-center justify-center">
        <img
          src={RegisterImg}
          alt="hiking"
          className="h-full max-w-none w-auto"
        />
      </div>
      <div className="flex flex-col justify-center items-center w-1/2 h-full">
        <div className="mt-auto flex flex-col justify-center items-center">
          <h3 className="loginTitle">Welcome!</h3>
          <p className="loginText">Sign up for free</p>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <Form className="w-full md:w-2/3">
                <Field
                  name="username"
                  type="text"
                  className="w-full bg-gray-200 px-4 py-2 rounded mt-2"
                  placeholder="Username"
                  required
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-2"
                />

                <Field
                  name="email"
                  type="email"
                  className="w-full bg-gray-200 px-4 py-2 rounded mt-2"
                  placeholder="Email"
                  required
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-2"
                />

                <Field
                  placeholder="Password"
                  name="password"
                  type="password"
                  className="w-full bg-gray-200 px-4 py-2 rounded mt-2"
                  required
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-2"
                />

                <button
                  type="submit"
                  className="w-full bg-yellow-400 text-white font-bold px-4 py-2 rounded mt-4"
                  disabled={!(formik.isValid && formik.dirty)}
                >
                  Register
                </button>

                {serverState && (
                  <p
                    className={
                      !serverState.ok
                        ? "errorMsg text-red-500"
                        : "text-green-600"
                    }
                  >
                    {serverState.msg}
                  </p>
                )}
              </Form>
            )}
          </Formik>
          <span className="span-0">Already have an account?</span>
          <Link style={{ textDecoration: "none" }} to="/login">
            <span className="span-1">Login</span>
          </Link>
        </div>
        <Footer />
      </div>
    </div>
  );
}
export default Register;
