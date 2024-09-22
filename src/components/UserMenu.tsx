import React, { useState, useEffect, useRef } from "react";
import {
  Link,
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Modal from "./Modal";
import { NavbarLinks } from "../types/types";
import { AuthContextType } from "../types/types";
import useParams from "../hooks/useParams";
import ToggleSwitch from "./ToggleSwitch";

const UserMenu: React.FC<{ Links: NavbarLinks[] }> = ({ Links = [] }) => {
  const { authUser, handleLogout }: AuthContextType = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [menuHidden, setMenuHidden] = useState<boolean>(true);
  const navigate: NavigateFunction = useNavigate();
  const currentLocation: Location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, setIsDarkMode } = useParams();

  const toggleMenuHidden = () => {
    setMenuHidden(!menuHidden);
  };

  const handleClickOutside = (e: any) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuHidden(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoutConfirmed = () => {
    setMenuHidden(true);
    handleLogout();
    setShowLogoutModal(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      <div className="relative m-1" ref={menuRef}>
        <button
          className="button flex bg-zinc-600 !py-1"
          type="button"
          id="dropdownUser"
          data-dropdown-toggle="dropdown"
          aria-expanded="false"
          onClick={toggleMenuHidden}
        >
          <span className="text-lg text-white">MENU</span>
          <span className="m-auto ps-2 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </svg>
          </span>
        </button>
        <div
          className={`${
            menuHidden ? "hidden" : "absolute right-0"
          } z-10 my-2 w-auto min-w-56 divide-y divide-zinc-100 rounded-lg border border-solid border-zinc-600 bg-white shadow dark:bg-zinc-600`}
        >
          <ul
            className="mb-0 flex w-full flex-col justify-end px-0 py-2 text-end text-base font-medium text-zinc-600 dark:text-zinc-200"
            aria-labelledby="dropdownMenu"
          >
            <li
              key={`userMenu-user`}
              className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-600 dark:hover:text-white"
            >
              {authUser?.firstName + " " + authUser?.lastName}
            </li>
            <div className="my-1 h-0.5 w-full bg-zinc-200"></div>

            {Links.map(
              (link, index) =>
                authUser?.roles.some((role) =>
                  link?.authRoles.includes(role?.userRole?.roleId),
                ) && (
                  <React.Fragment key={`fragment-${index}`}>
                    <li
                      className={`block px-4 py-2 font-medium no-underline ${
                        currentLocation.pathname === link?.href
                          ? `text-zinc-500`
                          : `text-zinc-600`
                      } text-zinc-600 hover:bg-zinc-100 lg:hidden dark:text-zinc-100 dark:hover:bg-zinc-600 dark:hover:text-white`}
                      key={`userMenu-${index}`}
                      onClick={toggleMenuHidden}
                    >
                      <Link to={link?.href}>{link?.label}</Link>
                    </li>
                    {link?.sublinks.length > 0 &&
                      link.sublinks.map((sublink, subIndex) => (
                        <li
                          key={`userMenu-${index}-${subIndex}`}
                          className={`block px-6 py-1 font-medium no-underline ${
                            currentLocation.pathname === link?.href
                              ? `text-zinc-500`
                              : `text-zinc-600`
                          } text-zinc-600 hover:bg-zinc-100 lg:hidden dark:text-zinc-100 dark:hover:bg-zinc-600 dark:hover:text-white`}
                        >
                          <Link to={sublink?.href}>
                            {sublink?.label} {"<"}
                          </Link>
                        </li>
                      ))}
                  </React.Fragment>
                ),
            )}
            <div className="my-1 h-0.5 w-full bg-zinc-200"></div>

            <li
              key={`toggleDarkMode`}
              className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-600 dark:hover:text-white"
            >
              <div className="flex items-center justify-end">
                <p>Dark mode: </p>

                <ToggleSwitch
                  enabled={isDarkMode}
                  handleToggle={toggleDarkMode}
                />
              </div>
            </li>
            <div className="my-1 h-0.5 w-full bg-zinc-200"></div>

            <li
              key={`userMenu-logout`}
              className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-600 dark:hover:text-white"
            >
              <button
                className="float-end"
                onClick={() => setShowLogoutModal(true)}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {showLogoutModal && (
        <Modal
          onOK={handleLogoutConfirmed}
          onCancel={() => setShowLogoutModal(false)}
          title="Odjava iz aplikacije"
          question="Da li ste sigurni da želite da se odjavite sa aplikacije?"
        />
      )}
    </>
  );
};

export default UserMenu;
