import React, { useState, useEffect, useContext } from "react";
import GeneralContext from "./GeneralContext";
import { Tooltip, Grow } from "@mui/material";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";

import { watchlist } from "../data/data";
import { DoughnutChart } from "./DoughnoutChart";
import { socket } from "./socket"; //  IMPORTANT

const WatchList = () => {
  //  make dynamic
  const [stocks, setStocks] = useState(watchlist);

  //  WebSocket real-time update
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("price_update", (prices) => {
      setStocks((prev) =>
        prev.map((stock) => {
          const newPrice = prices[stock.name];

          if (!newPrice) return stock;

          return {
            ...stock,
            price: newPrice,
            isDown: newPrice < stock.price, //  direction
            percent: (
              ((newPrice - stock.price) / stock.price) *
              100
            ).toFixed(2),
          };
        })
      );
    });

    return () => {
      socket.off("price_update");
    };
  }, []);

  //  chart data dynamic
  const labels = stocks.map((s) => s.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: stocks.map((s) => s.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search eg: infy, tcs..."
          className="search"
        />
        <span className="counts">{stocks.length} / 50</span>
      </div>

      <ul className="list">
        {stocks.map((stock, index) => (
          <WatchListItem stock={stock} key={index} />
        ))}
      </ul>

      <DoughnutChart data={data} />
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <li
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>
          {stock.name}
        </p>

        <div className="itemInfo">
          <span className="percent">
            {stock.percent || 0}%
          </span>

          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}

          <span className="price">₹{stock.price}</span>
        </div>
      </div>

      {showActions && <WatchListActions uid={stock.name} />}
    </li>
  );
};

const WatchListActions = ({ uid }) => {
  const generalContext = useContext(GeneralContext);

  return (
    <span className="actions">
      <span>
        <Tooltip title="Buy (B)" arrow TransitionComponent={Grow}>
          <button
            className="buy"
            onClick={() => generalContext.openBuyWindow(uid)}
          >
            Buy
          </button>
        </Tooltip>

        <Tooltip title="Sell (S)" arrow TransitionComponent={Grow}>
          <button
            className="sell"
            onClick={() => generalContext.openSellWindow(uid)}
          >
            Sell
          </button>
        </Tooltip>

        <Tooltip title="Analytics" arrow TransitionComponent={Grow}>
          <button className="action">
            <BarChartOutlined />
          </button>
        </Tooltip>

        <Tooltip title="More" arrow TransitionComponent={Grow}>
          <button className="action">
            <MoreHoriz />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};