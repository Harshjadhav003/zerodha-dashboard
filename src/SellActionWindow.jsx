import React, { useState } from "react";
import axios from "axios";

import "./BuyActionWindow.css";

const SellActionWindow = ({ uid, closeSellWindow }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0);

 const handleSellClick = async () => {
  if (!stockQuantity || !stockPrice) {
    alert("Enter valid quantity and price");
    return;
  }

  try {
    await axios.post(
      `${import.meta.env.VITE_DATA_API_URL}/orders`,
      {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: "SELL",
      },
      
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    closeSellWindow();
  } catch (err) {
    console.log("SELL ERROR:", err);
  }
};
  return (
    <div className="container" id="sell-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(Number(e.target.value))}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <button className="btn btn-orange" onClick={handleSellClick}>
            Sell
          </button>
          <button className="btn btn-grey" onClick={closeSellWindow}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
