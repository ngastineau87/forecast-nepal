import React from "react";
import { Link, BrowserRouter } from "react-router-dom";


import data from './cities.json'; // import list of the cities

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Marker
} from "react-simple-maps";


const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

var i;
var mark =[];


function createoption(c_title,c_serie){//function to create parameter in highchart
    return(
      {
        title: {
          text: c_title
        },
        series: [{
          data: c_serie
        }]
      }
      
    )
  }

for (i = 4956; i <= 5032; i++) {//this loop is too create a list mark containing data from cities.json to create the marker on the map
  var des=data[i].description;
  var lon=data[i].longitude;
  var la=data[i].latitude;
  var idd=data[i].id;
  mark.push({markerOffset: 15, id: idd, name: des, coordinates: [lon,la] });
}

const markers = mark;

function address(i){ //function to add area_id in url
  return '?area_id='+i
}
class MapChart extends  React.Component {
  constructor(props) {
    super(props);
      this.state = {
        clickedcity: "",
        clickedid: 0,
      };
  };
  createhighchart(){
    var id = this.state.clickedid
    if(id){
      return(
      <HighchartsReact
      highcharts={Highcharts}
      options={createoption(this.state.clickedcity,[0,0,0])}
      />
      )
    }
  }
  render() {

    return(
    <div>
    <BrowserRouter>
        <ComposableMap
            projection="geoAzimuthalEqualArea"
            projectionConfig={{
            rotate: [-84.2, -27.5, 0], // the parameters rotate and scale have been changed to zoom on nepal
            scale: 5600
            }}
        >
            <Graticule stroke="#EAEAEC" />
            <Geographies geography={geoUrl}>
                {({ geographies }) =>
                geographies.map(geo => (
                <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#9998A3"
                    stroke="#EAEAEC"
                />
                ))
                }
            </Geographies>
      
            {markers.map(({ name, id, coordinates}) => (
            <Link key={id} to={address(id)}>
                <Marker key={id} coordinates={coordinates} onClick={()=>this.setState({clickedcity: name, clickedid: id})} >
                <g
                    fill="none"
                    stroke="#FF5533"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin
            
                    ="round"
                    transform="translate(-12, -24)"
                >
                <circle cx="12" cy="10" r="3" />
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                </g>
                </Marker>
            </Link>
        ))}
        </ComposableMap>
    </BrowserRouter>
    {this.createhighchart()}
    </div>
    );
  }
}

export default MapChart;
