import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "@themesberg/flowbite";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./context/user-context";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
    <BrowserRouter>
      <React.StrictMode>
        <UserContextProvider>
            <App />
        </UserContextProvider>
      </React.StrictMode>
    </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
