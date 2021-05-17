import React from "react";
import { Link, BrowserRouter } from "react-router-dom";


import data from './cities.json'; // import list of the cities
import forecastdata from './forecast.json'; // import list of the forecast for each city

import { WiDaySunny,WiDaySunnyOvercast,WiCloud,WiFog,WiRainMix,WiShowers,WiSnow,WiSleet,WiThunderstorm,WiWindy} from 'weather-icons-react';
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

for (i = 4956; i <= 5032; i++) {//this loop is done to create a list of marks containing data from cities.json to create the marker on the map
  var des = data[i].description;
  var lon = data[i].longitude;
  var la = data[i].latitude;
  var idd = data[i].id;
  var spec_data = fdata[i];
  var spec_data2 = spec_data['params'];
  var spec_data3 = spec_data2['ww'];
  var spec_data4 = spec_data3['202105171200'];
  var gbweather = spec_data4['code'];
  mark.push({id: idd, name: des, coordinates: [lon,la], gbw: gbweather });
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
        clickedparam: 't',
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
            return(
            <HighchartsReact
                highcharts={Highcharts}
                options={createoption(this.state.clickedcity,tabdata,'t')}
                />
                )
        }
        else{
            var hu_data = spec_data2['hu'];
            for(i in hu_data){
                if(i!=='description'){
                    var hutemp = hu_data[i];
                    tabdata.push(parseFloat(hutemp['%']));
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
  }
  createbuttons(){
    var id = this.state.clickedid;
    if(id){
        return(
        <div>
            <button onClick={() => this.setState({clickedparam: 't'})}>Temperature</button>
            <button onClick={() => this.setState({clickedparam: 'h'})}>Humidity</button>
        </div>
        )
    }
 
  }
  createweathericon(code){
        if(code==='1' ||code==='2'){
            return(
            <WiDaySunny size={20} color='#000' />
            )
        }
        if(code==='3' ||code==='4'){
            return(
            <WiCloud size={20} color='#000' />
            )
        }
        if(code==='5'){
            return(
            <WiDaySunnyOvercast size={20} color='#000' />
            )
        }
        if(code==='6' || code==='7'|| code==='8'){
            return(
            <WiFog size={20} color='#000' />
            )
        }
        if(code==='10' || code==="11" || code==='12'){
            return(
            <WiRainMix size={20} color='#000' />
            )
        }
        if(code==='13' || code==='14'|code==='15'){
            return(
            <WiShowers size={20} color='#000' />
            )
        }
        if(code==='20' || code==='21' || code==='22' || code==='23' || code==='24' || code==='25'){
            return(
            <WiSnow size={20} color='#000' />
            )
        }
        if(code==='26'){
            return(
            <WiSleet size={20} color='#000' />
            )
        }
        if(code==='30' || code==='31' || code==='32' || code==='33'){
            return(
            <WiThunderstorm size={20} color='#000' />
            )
        }
        if(code==='40'){
            return(
            <WiWindy size={20} color='#000' />
            )
        }
        return(
        <WiDaySunny size={20} color='#000' />

        )
  }
  render() {

    return(
    <div>
    {this.createbuttons()}
    {this.createhighchart()}
    <BrowserRouter>
        <ComposableMap
            projection="geoAzimuthalEqualArea"
            projectionConfig={{
            rotate: [-84.2, -28, 0], // the parameters rotate and scale have been changed to zoom on nepal
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
      
            {markers.map(({ name, id, coordinates,gbw}) => (
            <Link key={id} to={address(id)}>
                <Marker key={id} coordinates={coordinates} onClick={()=>this.setState({clickedcity: name, clickedid: id})} >
                    {this.createweathericon(gbw)}
                </Marker>
            </Link>
        ))}
        </ComposableMap>
    </BrowserRouter>
    </div>
    );
  }
}

export default MapChart;
