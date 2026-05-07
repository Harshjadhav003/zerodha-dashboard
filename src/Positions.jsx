import React, { useState, useEffect } from "react";
import axios from "axios";

import { socket } from "./socket"; 


//import { positions } from "../data/data.js";

const Positions = () => {
    const [allPositions, setAllPositions] = useState([]);


useEffect(() => {
  // Initial fetch
  axios.get(`${import.meta.env.VITE_DATA_API_URL}/positions`)
    .then((res) => {
      setAllPositions(res.data.data);
    })
    .catch((err) => {
      console.log("ERROR:", err);
    });

  //  LIVE PRICE UPDATE (for LTP)
  socket.on("price_update", (prices) => {
    setAllPositions((prev) =>
      prev.map((pos) => ({
        ...pos,
        price: prices[pos.name] || pos.price,
      }))
    );
  });

  //  LIVE ORDER UPDATE (when buy/sell happens)
  socket.on("positions_update", (update) => {
    console.log("positions_update:", update);

    // simple approach: refetch positions
    axios.get(`${import.meta.env.VITE_DATA_API_URL}/positions`)
      .then((res) => {
        setAllPositions(res.data.data);
      });
  });

  // cleanup
  return () => {
    socket.off("positions_update");
    socket.off("orderUpdate");
  };
}, []);
  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      <div className="order-table">
        <table>
          <tr>
            <th>Product</th>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg.</th>
            <th>LTP</th>
            <th>P&L</th>
            <th>Chg.</th>
          </tr>
              {allPositions.map((stock, index) => {
                           const curValue = stock.price * stock.qty;
                           const isProfit = curValue - stock.avg * stock.qty >= 0;
                           const profClass = isProfit ? "profit" : "loss";
                           const dayClass = stock.isLoss ? "loss" : "profit";
             
                           return (
                             <tr key={index}>
                               <td>{stock.product}</td>
                               <td>{stock.name}</td>
                               <td>{stock.qty}</td>
                               <td>{stock.avg.toFixed(2)}</td>
                               <td>{stock.price.toFixed(2)}</td>
                               <td className={profClass}>
                                 {(curValue - stock.avg * stock.qty).toFixed(2)}
                               </td>
                               <td className={dayClass}>{stock.day}</td>
                             </tr>
                           );
                         })}
        </table>
      </div>
    </>
  );
};

export default Positions;
