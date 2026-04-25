import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_DATA_API_URL}/holdings`)
      .then((res) => {
        setAllHoldings(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to load holdings");
        setLoading(false);
      });
  }, []);

  //  Calculations
  const totalInvestment = allHoldings.reduce(
    (acc, stock) => acc + stock.avg * stock.qty,
    0
  );

  const currentValue = allHoldings.reduce(
    (acc, stock) => acc + stock.price * stock.qty,
    0
  );

  const pnl = currentValue - totalInvestment;
  const pnlPercent = totalInvestment
    ? ((pnl / totalInvestment) * 100).toFixed(2)
    : 0;

  // 📊 Graph Data
  const labels = allHoldings.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  // ⏳ Loading UI
  if (loading) return <h3>Loading holdings...</h3>;

  //  Error UI
  if (error) return <h3>{error}</h3>;

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>

          <tbody>
            {allHoldings.map((stock) => {
              const curValue = stock.price * stock.qty;
              const profit = curValue - stock.avg * stock.qty;
              const isProfit = profit >= 0;

              const netPercent = (
                ((stock.price - stock.avg) / stock.avg) *
                100
              ).toFixed(2);

              return (
                <tr key={stock._id}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>

                  <td className={isProfit ? "profit" : "loss"}>
                    {profit.toFixed(2)}
                  </td>

                  <td className={isProfit ? "profit" : "loss"}>
                    {netPercent}%
                  </td>

                  <td className={stock.isLoss ? "loss" : "profit"}>
                    {stock.day}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 📊 Summary Section */}
      <div className="row">
        <div className="col">
          <h5>{totalInvestment.toFixed(2)}</h5>
          <p>Total investment</p>
        </div>

        <div className="col">
          <h5>{currentValue.toFixed(2)}</h5>
          <p>Current value</p>
        </div>

        <div className="col">
          <h5 className={pnl >= 0 ? "profit" : "loss"}>
            {pnl.toFixed(2)} ({pnlPercent}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>

      {/* 📊 Graph */}
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;