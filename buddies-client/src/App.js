import "./App.css"
import { Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import "react-toastify/dist/ReactToastify.css"
import Home from "./components/Home"
import Login from "./components/Login"
import Map from "./components/Map"
import NotFound from "./components/NotFound"
import Profile from "./components/Profile"
import Register from "./components/Register"

function App() {
  return (
    <div>
      <ToastContainer
        limit={1}
        position="top-center"
        newestOnTop
        hideProgressBar={false}
        autoClose={4000}
      />

      <Routes>
        <Route path="*" element={<NotFound />} />

        <Route path="/" element={<Home />} exact />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </div>
  )
}

export default App
