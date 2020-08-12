import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.scss";

import { App } from "./containers/App";

ReactDOM.render(<App />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept();
}
