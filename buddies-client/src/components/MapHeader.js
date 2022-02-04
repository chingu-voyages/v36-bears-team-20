import { useContext } from "react";

import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import { red, blue } from "@mui/material/colors";
import Fab from "@mui/material/Fab";

import { UserContext } from "../context/user-context";

export default function MapHeader(props) {
  const { user, handleSignOut, hamburgerIsOpen, setHamburgerIsOpen } =
    useContext(UserContext);

  return (
    <header className="my-3 flex justify-center items-center absolute bottom-10 left-5 z-10">
      <div className="relative flex justify-center items-center w-full gap-x-2">
        <Fab
          color="inherit"
          aria-label="add"
          onClick={() => {
            setHamburgerIsOpen(false);
            return props.handleDropPin();
          }}
          sx={{
            color: "common.white",
            bgcolor: red[500],
            "&:hover": {
              bgcolor: red[600],
            },
          }}
        >
          <AddIcon />
        </Fab>
        <Fab
          color="inherit"
          aria-label="menu"
          onClick={() => {
            setHamburgerIsOpen((prev) => {
              return !prev;
            });
          }}
          sx={{
            color: "common.white",
            bgcolor: blue[500],
            "&:hover": {
              bgcolor: blue[600],
            },
          }}
          id="dropdownTopButton"
        >
          <MenuIcon />
        </Fab>
        <div
          id="dropdownTop"
          className={`${
            !hamburgerIsOpen && "hidden"
          } absolute bottom-20 left-2 z-10 w-60 text-2xl list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700`}
        >
          <ul className="py-1" aria-labelledby="dropdownTopButton">
            {[
              { label: "Home", href: "/", isLoggedIn: user }, // Always show 'Home' option regardless of isLoggedIn status.
              { label: "Profile", href: "/profile", isLoggedIn: true },
              {
                label: "Sign Out",
                href: "/",
                onClick: handleSignOut,
                isLoggedIn: true,
              },
              { label: "Sign In", href: "/login", isLoggedIn: false },
            ]
              .filter((option) => option.isLoggedIn === user)
              .map((option) => {
                return (
                  <li key={option.label}>
                    <a
                      href={option.href}
                      className="block py-2 px-4 text-lg font-bold text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      onClick={option?.onClick}
                    >
                      {option.label}
                    </a>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </header>
  );
}
