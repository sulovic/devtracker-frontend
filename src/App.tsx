import React, { useEffect } from "react";
import { ParamsContextType } from "./types/types";
import SiteRoutes from "./components/SiteRoutes";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useParams from "./hooks/useParams";

const App: React.FC<{}> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, setIsDarkMode }: ParamsContextType = useParams();

  useEffect(() => {
    // Check localStorage for dark mode setting
    const savedTheme: string | null = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark");
  }, []);

  useEffect(() => {
    // Add or remove the 'dark' class from the <html> element
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save the theme to localStorage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("lastRoute", location.pathname);
  }, [location]);

  useEffect(() => {
    const storedPath = localStorage.getItem("lastRoute");
    if (storedPath && storedPath !== location.pathname) {
      navigate(storedPath);
    }
  }, [navigate, location]);

  return (
    <>
      <ToastContainer />
      <SiteRoutes />
    </>
  );
};

export default App;
