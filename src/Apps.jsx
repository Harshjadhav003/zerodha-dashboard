import React from "react";

const Apps = () => {
  return (
    <div className="apps-container">
      <h1>Apps</h1>

      <div className="apps-grid">
        <div className="app-card">
          <h3>📊 Dashboard</h3>
          <p>View portfolio & analytics</p>
        </div>

        <div className="app-card">
          <h3>📈 Trading</h3>
          <p>Buy and sell stocks</p>
        </div>

        <div className="app-card">
          <h3>📑 Orders</h3>
          <p>Track your orders</p>
        </div>

        <div className="app-card">
          <h3>💼 Holdings</h3>
          <p>Check your investments</p>
        </div>
      </div>
    </div>
  );
};

export default Apps;