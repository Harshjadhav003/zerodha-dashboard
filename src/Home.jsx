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
          "http://localhost:3002",
          {},
          { withCredentials: true }
        );

        if (!data.success) {
          window.location.href = "http://localhost:5173/login";
        } else {
          setUser(data.user); //  set username
        }
      } catch (error) {
        console.error(error);
        window.location.href = "http://localhost:5173/login";
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