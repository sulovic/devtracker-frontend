import { useEffect } from "react";
import SiteRoutes from "./components/SiteRoutes";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
