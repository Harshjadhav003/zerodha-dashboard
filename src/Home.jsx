import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

//  global config (cookies)
axios.defaults.withCredentials = true;

const Home = () => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // Extract token from URL if redirected from login page (cross-origin fallback)
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get("token");
        
        if (urlToken) {
          localStorage.setItem("token", urlToken);
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        const token = localStorage.getItem("token");

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/verify`,
          {
            withCredentials: true,
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!data.success) {
          window.location.replace(`${import.meta.env.VITE_FRONTEND_URL}/login`);
        } else {
          setUser({ username: data.user });
        }

      } catch (error) {
        console.error(error);
        window.location.replace(`${import.meta.env.VITE_FRONTEND_URL}/login`);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("token");
      window.location.replace(`${import.meta.env.VITE_FRONTEND_URL}/login`);
    }
  };

  //  prevent UI flicker
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <TopBar user={user} onLogout={handleLogout} />
      <Dashboard user={user} />
    </>
  );
};

export default Home;