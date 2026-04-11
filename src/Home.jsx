import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axios.post(
          "https://docker-setup-backend-latest.onrender.com/verify",
          {},
          { withCredentials: true }
        );

        if (!data.success) {
          navigate("/login");
        } else {
          setUser(data.user);
        }
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };

    verifyUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://docker-setup-backend-latest.onrender.com/logout",
        {},
        { withCredentials: true }
      );

      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <TopBar user={user} onLogout={handleLogout} />
      <Dashboard user={user} />
    </>
  );
};

export default Home;