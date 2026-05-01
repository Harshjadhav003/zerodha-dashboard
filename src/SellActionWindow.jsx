import React, { useState } from "react";
import axios from "axios";

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
    <div className="buy-window"> {/* you can reuse same CSS */}
      <h3>Sell {uid}</h3>

      <input
  type="number"
  value={stockQuantity}
  onChange={(e) => setStockQuantity(Number(e.target.value))}
  placeholder="Quantity"
/>

<input
  type="number"
  value={stockPrice}
  onChange={(e) => setStockPrice(Number(e.target.value))}
  placeholder="Price"
/>

      <div>
        <button onClick={handleSellClick}>Sell</button>
        <button onClick={closeSellWindow}>Cancel</button>
      </div>
    </div>
  );
};

export default SellActionWindow;