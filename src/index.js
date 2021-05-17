import React from "react";
import ReactDOM from "react-dom";


import MapChart from "./Mapchart";





class Weathernepalapp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "t",
    };
  };

  render() {
    return (
      <div>
        <div>
          <MapChart />
        </div>
      </div>
    );
  }
}


const rootElement = document.getElementById("root");
ReactDOM.render(<Weathernepalapp />, rootElement);