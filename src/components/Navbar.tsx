import React, { useEffect, useRef, useState } from "react";
import { Link, Location, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import UserMenu from "./UserMenu";
import { NavbarLinks } from "../types/types.js";
import type { AuthContextType } from "../types/types.js";

const DropDown: React.FC<{ link: NavbarLinks; index: number }> = ({
  link,
  index,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentLocation: Location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: any) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <li
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-10 mt-3 min-w-24 text-end text-lg font-medium lg:!mt-0 lg:inline-block"
        key={`mainlink-${index}`}
      >
        <Link
          className={`mr-4 no-underline ${currentLocation.pathname === link?.href ? `text-sky-200` : `text-sky-100`} hover:text-white`}
          to={link?.href}
        >
          {link?.label}
          {link?.sublinks.length > 0 && (
            <span className="inline-block pl-1">▼</span>
          )}
        </Link>
        {isOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 mt-4 min-w-40 bg-sky-400 px-4 pt-2 font-medium shadow-lg ring-1 ring-sky-200 ring-opacity-20 dark:bg-sky-600"
          >
            <ul
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {link?.sublinks.map((sublink, subIndex) => (
                <li
                  key={`navbar-${index}-${subIndex}`}
                  className="pb-2"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <Link
                    className={`block no-underline ${currentLocation.pathname === sublink?.href ? `text-sky-200` : `text-sky-100`} hover:text-white`}
                    to={sublink?.href}
                  >
                    {sublink?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    </>
  );
};

const Navbar: React.FC<{ Links?: NavbarLinks[] }> = ({ Links = [] }) => {
  const { authUser }: AuthContextType = useAuth();
  const currentLocation: Location = useLocation();

  return (
    <nav
      tabIndex={-1}
      className={`mb-3 flex flex-wrap items-center justify-between bg-sky-400 p-1 dark:bg-sky-600`}
    >
      <Link to="/" className="flex items-center ps-2">
        <img src={"/favicon.png"} alt="Logo" className="h-10" />
      </Link>
      <div className="mr-6 flex items-center ps-2">
        <h4 className="text-white">DevTracker</h4>
      </div>
      <div className="hidden lg:flex lg:w-auto lg:flex-grow lg:items-center">
        {authUser && (
          <ul className="mb-0">
            {Links.map(
              (link, index) =>
                authUser?.roles.some((role) =>
                  link?.authRoles?.includes(role?.userRole?.roleId),
                ) &&
                (link.sublinks.length === 0 ? (
                  <li
                    className="mt-3 text-end text-lg font-medium lg:!mt-0 lg:inline-block"
                    key={`navbar-${index}`}
                  >
                    <Link
                      className={`mr-4 no-underline ${currentLocation.pathname === link?.href ? `text-sky-200` : `text-sky-100`} hover:text-white`}
                      to={link?.href}
                    >
                      {link?.label}
                    </Link>
                  </li>
                ) : (
                  <React.Fragment key={`navbar-fragment-${index}`}>
                    <DropDown link={link} index={index} />
                  </React.Fragment>
                )),
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
