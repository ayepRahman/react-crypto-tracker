import React from "react";
import Market from "pages/Market";

const url =
  "https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=1";

const App = () => {
  return (
    <div>
      <Market />
    </div>
  );
};

export default App;
