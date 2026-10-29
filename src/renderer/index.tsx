import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import "./index.scss";

import { App } from "./containers/App";

// Reuse the root across hot reloads so React doesn't mount twice on #app.
const root: Root = module.hot?.data?.root ?? createRoot(document.querySelector("#app")!);
root.render(<App />);

if (module.hot) {
  module.hot.dispose((data) => {
    data.root = root;
  });
  module.hot.accept();
}
