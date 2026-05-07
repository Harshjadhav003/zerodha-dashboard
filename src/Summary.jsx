import React, { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "./socket";

const Summary = ({ user }) => {
  const [holdings, setHoldings] = useState([]);

  //  Fetch holdings
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_DATA_API_URL}/holdings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      setHoldings(res.data.data);
    });
  }, []);

  //  Live price update
  useEffect(() => {
    socket.on("price_update", (prices) => {
      setHoldings((prev) =>
        prev.map((h) => ({
          ...h,
          price: prices[h.name] || h.price,
        }))
      );
    });

    return () => socket.off("price_update");
  }, []);

  // 🔹 Calculations
  const investment = holdings.reduce(
    (acc, h) => acc + h.avg * h.qty,
    0
  );

  const currentValue = holdings.reduce(
    (acc, h) => acc + h.price * h.qty,
    0
  );

  const pnl = currentValue - investment;

  const pnlPercent = investment
    ? ((pnl / investment) * 100).toFixed(2)
    : 0;

  const isProfit = pnl >= 0;

  return (
    <div className="summary-container">

      {/* USER */}
      <div className="username">
        <h6>{user?.username}</h6>
        <hr className="divider" />
      </div>

      {/* EQUITY */}
      <div className="section">
        <span><p>Equity</p></span>

        <div className="data">
          <div className="first">
            <h3>{currentValue.toFixed(2)}</h3>
            <p>Margin available</p>
          </div>

          <hr />

          <div className="second">
            <p>Margins used <span>0</span></p>
            <p>Opening balance <span>{investment.toFixed(2)}</span></p>
          </div>
        </div>

        <hr className="divider" />
      </div>

      {/* HOLDINGS */}
      <div className="section">
        <span>
          <p>Holdings ({holdings.length})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={isProfit ? "profit" : "loss"}>
              {pnl.toFixed(2)} <small>{pnlPercent}%</small>
            </h3>
            <p>P&L</p>
          </div>

          <hr />

          <div className="second">
            <p>
              Current Value <span>{currentValue.toFixed(2)}</span>
            </p>
            <p>
              Investment <span>{investment.toFixed(2)}</span>
            </p>
          </div>
        </div>

        <hr className="divider" />
      </div>
    </div>
  );
};

export default Summary;