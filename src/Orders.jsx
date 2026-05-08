import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { socket } from "./socket";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);


useEffect(() => {
  //  Initial fetch
  axios.get(`${import.meta.env.VITE_DATA_API_URL}/orders`, {
    withCredentials: true,
  })
    .then((res) => {
      setAllOrders(res.data.data);
    })
    .catch((err) => {
      console.error("Error fetching orders:", err);
    });

  //  REAL-TIME ORDER UPDATE
 socket.on("orderUpdate", (update) => {
  if (update.status === "EXECUTED") {
    setAllOrders((prev) => [update.data, ...prev]);
  }
});

  // cleanup
  return () => {
    socket.off("orderUpdate");
  };
}, []);

  return (
    <div className="orders">
      {allOrders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders today</p>

          <Link to={"/"} className="btn">
            Get started
          </Link>
        </div>
      ) : (
        <>
          <h3 className="title">Orders ({allOrders.length})</h3>

          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Price</th>
                  <th>Mode</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.map((order, index) => {
                  return (
                    <tr key={index}>
                      <td>{order.name}</td>
                      <td>{order.qty}</td>
                      <td>{order.price.toFixed(2)}</td>
                      <td>{order.mode}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
