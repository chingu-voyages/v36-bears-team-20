import PlusImage from "../images/plus.png";
import HamburgerImg from "../images/hamburger.png";

export default function MapHeader(props) {
  return (
    <header className="my-3 flex justify-center items-center absolute bottom-10 left-5 z-10">
      <div className="flex justify-center items-center w-full gap-x-2">
        <button className="" onClick={props.handleDropPin}>
          <img src={PlusImage} alt="plus" className="w-14 h-14 ml-2" />
        </button>
        <button
          className=""
          id="dropdownTopButton"
          data-dropdown-toggle="dropdownTop"
          data-dropdown-placement="top"
        >
          <img src={HamburgerImg} alt="menu" className="w-14 h-14 ml-2" />
        </button>
      </div>
      <div
        id="dropdownTop"
        className="hidden z-10 w-60 text-2xl list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700"
      >
        <ul className="py-1" aria-labelledby="dropdownTopButton">
          <li>
            <a
              href="/"
              className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/"
              className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              Settings
            </a>
          </li>
          <li>
            <a
              href="/"
              className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              Earnings
            </a>
          </li>
          <li>
            <a
              href="/"
              className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              Sign out
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
