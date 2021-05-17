import React from "react";
import { Link, BrowserRouter } from "react-router-dom";


import data from './cities.json'; // import list of the cities
import forecastdata from './forecast.json'; // import list of the forecast for each city

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

const fdata = forecastdata['data'];

function createoption(c_title,c_serie,t_or_h){//function to create parameter in highchart
    if(t_or_h==='t'){
        return(
        {
        chart: {
            type: 'spline',
            scrollablePlotArea: {
                minWidth: 600,
                scrollPositionX: 1
            }
        },
        title: {
          text: c_title
        },
        yAxis: {
            title: {
                text: 'Celsius'
            }
        },
        xAxis: {
            type: 'datetime',
            labels: {
                overflow: 'justify'
            }
        },
        plotOptions: {
            spline: {
                lineWidth: 4,
                states: {
                    hover: {
                        lineWidth: 5
                    }
                },
                marker: {
                    enabled: false
                },
                pointInterval: 3600000*6, // six hours
                pointStart: Date.UTC(2021, 4, 16, 0, 0, 0)
            }
        },
        series: [{
          name: 'Temperature in '+c_title,
          data: c_serie
        }]
        }
        )
    }
    else{
        return(
            {
            chart: {
                type: 'spline',
                scrollablePlotArea: {
                    minWidth: 600,
                    scrollPositionX: 1
                }
            },
            title: {
              text: c_title
            },
            yAxis: {
                title: {
                    text: '% of humidity'
                }
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    overflow: 'justify'
                }
            },
            plotOptions: {
                spline: {
                    lineWidth: 4,
                    states: {
                        hover: {
                            lineWidth: 5
                        }
                    },
                    marker: {
                        enabled: false
                    },
                    pointInterval: 3600000*6, // six hours
                    pointStart: Date.UTC(2021, 4, 16, 0, 0, 0)
                }
            },
            series: [{
              name: 'Humidity in '+c_title,
              data: c_serie
            }]
            }
            )

    }
  }

for (i = 4956; i <= 5032; i++) {//this loop is too create a list mark containing data from cities.json to create the marker on the map
  var des = data[i].description;
  var lon = data[i].longitude;
  var la = data[i].latitude;
  var idd = data[i].id;
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
        clickedparam: 'h',
      };
  };
  createhighchart(){
    var id = this.state.clickedid;
    var param = this.state.clickedparam;
    if(id){
        var spec_data = fdata[id];
        var spec_data2 = spec_data['params'];
        var tabdata = [];
        if(param==='t'){
            var temp_data = spec_data2['t'];
            for(i in temp_data){
                if(i!=='description'){
                    var celtemp = temp_data[i];
                    tabdata.push(parseFloat(celtemp['C']));
                }
            }
        }
        else{
            var hu_data = spec_data2['hu'];
            for(i in hu_data){
                if(i!=='description'){
                    var hutemp = hu_data[i];
                    tabdata.push(parseFloat(hutemp['%']));
                }
            }
        }
        return(
        <HighchartsReact
        highcharts={Highcharts}
        options={createoption(this.state.clickedcity,tabdata,'h')}
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
