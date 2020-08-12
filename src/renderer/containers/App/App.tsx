import * as React from "react";

const { ipcRenderer: ipc } = window.require("electron");

export type Props = {};

export class App extends React.Component<Props> {
  state = {
    time: +new Date(),
  };
  render() {
    return (
      <div>
        <h1>Electron with TypeScript and React (and SCSS)</h1>
        <p>Node version: {ipc.sendSync("version")}</p>
      </div>
    );
  }

  componentDidMount() {
    setInterval(() => this.setState({ time: +new Date() }), 3);
  }
}
