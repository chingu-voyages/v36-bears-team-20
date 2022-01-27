import "@fortawesome/fontawesome-free/css/all.min.css"
import "react-datepicker/dist/react-datepicker.css"
import "@themesberg/flowbite"
import React from "react"

import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"

import App from "./App"
// eslint-disable-next-line import/order
import { UserContextProvider } from "./context/user-context"

import "./index.css"

import reportWebVitals from "./reportWebVitals"

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
