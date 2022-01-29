import { useContext, useState } from "react";

import { UserContext } from "../context/user-context";
import HamburgerImg from "../images/hamburger.png";
import PlusImage from "../images/plus.png";

export default function MapHeader(props) {
  const { isLoggedIn, handleSignOut } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="my-3 flex justify-center items-center absolute bottom-10 left-5 z-10">
      <div className="relative flex justify-center items-center w-full gap-x-2">
        <button className="" onClick={props.handleDropPin}>
          <img src={PlusImage} alt="plus" className="w-14 h-14 ml-2" />
        </button>
        <button
          onClick={() => {
            setIsOpen((prev) => {
              return !prev;
            });
          }}
          className=""
          id="dropdownTopButton"
        >
          <img src={HamburgerImg} alt="menu" className="w-14 h-14 ml-2" />
        </button>
        <div
          id="dropdownTop"
          className={`${
            !isOpen && "hidden"
          } absolute bottom-20 left-2 z-10 w-60 text-2xl list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700`}
        >
          <ul className="py-1" aria-labelledby="dropdownTopButton">
            <li>
              <a
                href="/"
                className="block py-2 px-4 text-lg font-bold text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Home
              </a>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <a
                    href="/profile"
                    className="block py-2 px-4 text-lg font-bold text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Profile
                  </a>
                </li>

                <li>
                  <a
                    href="/"
                    onClick={handleSignOut}
                    className="block py-2 px-4 text-lg font-bold text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign out
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a
                    href="/login"
                    className="block py-2 px-4 text-lg font-bold text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign in
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
