import React from "react";
import Menu from "./Menu";

const TopBar = ({ user }) => {
  return (
    <div className="topbar-container">

      {/* LEFT */}
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points">100.2</p>
        </div>

        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points">100.2</p>
        </div>
      </div>

      {/* RIGHT */}
      <Menu user={user} />
    </div>
  );
};

export default TopBar;