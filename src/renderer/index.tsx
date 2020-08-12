import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.scss";

import { App } from "./containers";

ReactDOM.render(<App />, document.querySelector("body"));

if (module.hot) {
  module.hot.accept();
}
