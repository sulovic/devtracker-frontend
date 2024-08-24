import React from "react";
import { Link, Location, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";
import UserMenu from "./UserMenu";
import { NavbarLinks } from "../types/types.js";
import type { AuthContextType } from "../types/types.js";

const Navbar: ({ Links }: { Links: NavbarLinks [] }) => JSX.Element = ( {Links = []} ) => {
  const { authUser }: AuthContextType = useAuth();
  const currentLocation: Location = useLocation();

  return (
    <nav tabIndex={-1} className={`mb-3 flex flex-wrap items-center justify-between bg-sky-400 p-1`}>
      <Link to="/" className="ps-2 flex  items-center">
        <img src={"/favicon.png"} alt="Logo" className="h-10" />
      </Link>
      <div className="ps-2 mr-6 flex  items-center">
        <h4 className="text-white">DevTracker</h4>
      </div>
      <div className="hidden lg:flex lg:w-auto lg:flex-grow lg:items-center">
        {authUser && (
          <ul className="mb-0">
            {Links.map(
              (link, index) =>
                authUser?.roles.some((role) => role?.roleId > link?.minRole) && (
                  <li className="mt-3 text-end	text-lg font-medium lg:!mt-0 lg:inline-block" key={index}>
                    <Link
                      className={`mr-4 no-underline ${currentLocation.pathname === link?.href ? `text-sky-200` : `text-sky-100`} hover:text-white`}
                      to={link?.href}
                    >
                      {link?.label}
                    </Link>
                  </li>
                )
            )}
          </ul>
        )}
      </div>
      <div className="flex justify-end pe-1">
        <UserMenu Links={Links} />
      </div>
    </nav>
  );
};

export default Navbar;
