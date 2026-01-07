import React from "react";

import UserDropdown from "components/Dropdowns/UserDropdown.js";
import LanguageSwitcher from "components/LanguageSwitcher/LanguageSwitcher.js";


export default function Navbar() {
  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <a
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            Dashboard
          </a>
          {/* User */}
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
            <li className="flex items-center mr-3">
              <LanguageSwitcher />
            </li>

            <UserDropdown />
          </ul>
        </div>
      </nav>
    </>
  );
}
