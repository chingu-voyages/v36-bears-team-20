import React, { useContext, useState } from "react";
import { UserContext } from "../context/user-context";
import BlankProfile from "../images/blankProfile.png";

function Navbar() {
  const { isLoggedIn, handleSignOut } = useContext(UserContext);

  const [ isExpanded, setExpand ] = useState(false);

  return (
    <header>
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container px-6 py-3 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between">
              <div className="text-xl font-semibold text-gray-700">
                <a
                  className="text-2xl font-bold text-gray-800 dark:text-white lg:text-3xl hover:text-gray-700 dark:hover:text-gray-300"
                  href="/"
                >
                  {/* <img
                    src={logo}
                    alt="logo"
                    className="rounded-lg shadow-lg"
                    width={120}
                  /> */}
                  <h1>Buddies</h1>
                </a>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-between">
              <div className="flex flex-col mx-4 md:mx-8">
                <a
                  href="/"
                  className="px-2 mx-2  text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded-md md:mt-0 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                  About
                </a>
              </div>
              <div className="flex items-center mt-1 md:mt-0">
                {isLoggedIn ? <>
                  <div className="ml-3 relative">
                    <div>
                      <button type="button" className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu-button" aria-haspopup="true"
                        aria-expanded={isExpanded ? "true" : "false"}
                        onClick={() => setExpand((state) => !state)}
                        onBlur={() => setTimeout(() => setExpand(false), 100)}
                      >
                        <span className="sr-only">Open user menu</span>
                        <img className="h-8 w-8 rounded-full" src={BlankProfile} alt="Profile" />
                      </button>
                    </div>
                    <div className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${
                      isExpanded ? "transition ease-out duration-100 transform opacity-100 scale-100"
                        : "transition ease-in duration-75 transform opacity-0 scale-0"
                      }`} role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1"
                    >
                      <a href="/profile" role="menuitem" tabindex="-1">
                        <button className="block px-4 py-2 text-sm text-gray-700">
                          My Profile
                        </button>
                      </a>
                      <a href="/map" role="menuitem" tabindex="-1">
                        <button className="block px-4 py-2 text-sm text-gray-700">
                          Map
                        </button>
                      </a>
                      <button
                        role="menuitem" tabindex="-1"
                        onClick={handleSignOut}
                        className="block px-4 py-2 text-sm text-gray-700"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </> : (
                  <a href="/login">
                    <button className="bg-yellow-400 text-white px-4 py-2 rounded mx-4 uppercase shadow-xl hover:bg-yellow-500 font-bold">
                      Sign in
                    </button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
