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
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/verify`
        );

        if (!data.success) {
          navigate("/login");
        } else {
          setUser(data.user);
        }

      } catch (error) {
        console.error(error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/logout`
      );

      navigate("/login");

    } catch (error) {
      console.error(error);
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