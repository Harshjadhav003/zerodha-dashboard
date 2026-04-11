import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Menu = ({ user }) => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
  try {
    await axios.post(
      "https://docker-setup-backend-latest.onrender.com/logout",
      {},
      { withCredentials: true }
    );

    window.location.href = "https://zerodha-frontend-gilt.vercel.app/login";
  } catch (err) {
    console.error(err);
  }
};
  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">

      <img src="logo.png" style={{ width: "50px" }} alt="logo" />

      <div className="menus">
        <ul>

          <li>
            <Link to="/" style={{ textDecoration: "none" }}>
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}
                onClick={() => handleMenuClick(0)}>
                Dashboard
              </p>
            </Link>
          </li>

          <li>
            <Link to="/orders" style={{ textDecoration: "none" }}>
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}
                onClick={() => handleMenuClick(1)}>
                Orders
              </p>
            </Link>
          </li>

          <li>
            <Link to="/holdings" style={{ textDecoration: "none" }}>
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}
                onClick={() => handleMenuClick(2)}>
                Holdings
              </p>
            </Link>
          </li>

          <li>
            <Link to="/positions" style={{ textDecoration: "none" }}>
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}
                onClick={() => handleMenuClick(3)}>
                Positions
              </p>
            </Link>
          </li>

          <li>
            <Link to="/funds" style={{ textDecoration: "none" }}>
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}
                onClick={() => handleMenuClick(4)}>
                Funds
              </p>
            </Link>
          </li>

          <li>
            <Link to="/apps" style={{ textDecoration: "none" }}>
              <p className={selectedMenu === 5 ? activeMenuClass : menuClass}
                onClick={() => handleMenuClick(5)}>
                Apps
              </p>
            </Link>
          </li>

        </ul>

        <hr />

        {/* PROFILE */}
        <div className="profile" onClick={handleProfileClick}>
          <div className="avatar">{user?.slice(0,2).toUpperCase()}</div>
          <p className="username">{user}</p>
        </div>

        {/* DROPDOWN */}
        {isProfileDropdownOpen && (
          <div className="profile-dropdown">
            <p>Profile</p>
            <p>Settings</p>
            <p onClick={handleLogout}>Logout</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;