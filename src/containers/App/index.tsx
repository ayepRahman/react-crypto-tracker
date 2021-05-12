import React from "react";
import Market from "containers/Market";
import Coins from "containers/Coins";
import PoweredBy from "components/PoweredBy";
import { Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      {/* <Switch>
        <Route exact path="/">
          <Coins />
        </Route>
        <Route exact path="/market">
          <Market />
        </Route>
      </Switch> */}
      <PoweredBy />
    </div>
  );
};

export default App;
