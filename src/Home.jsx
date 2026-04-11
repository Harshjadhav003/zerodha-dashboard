import React, { useEffect, useState } from "react";
import axios from "axios";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  const [user, setUser] = useState("");

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axios.post(
          "https://docker-setup-backend-latest.onrender.com",
          {},
          { withCredentials: true }
        );

        if (!data.success) {
          window.location.href = "https://zerodha-frontend-gilt.vercel.app/login";
        } else {
          setUser(data.user); //  set username
        }
      } catch (error) {
        console.error(error);
        window.location.href = "https://zerodha-frontend-gilt.vercel.app/login";
      }
    };

    verifyUser();
  }, []);

  return (
    <>
      <TopBar user={user} />
      <Dashboard user={user} />
    </>
  );
};

export default Home;