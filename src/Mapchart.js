import React from "react";
import { Link, BrowserRouter } from "react-router-dom";


import data from './cities.json'; // import list of the cities
import forecastdata from './forecast.json'; // import list of the forecast for each city

import { WiDaySunny, WiDaySunnyOvercast, WiCloud, WiFog, WiRainMix, WiShowers, WiSnow, WiSleet, WiThunderstorm, WiWindy} from 'weather-icons-react';//icons to describe the global weather of a city
import Highcharts from 'highcharts';//graphic to describe the temperature and humidity of a city
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

function createoption(c_title,c_serie,t_or_h){//function to create parameter in highcharts
    if(t_or_h==='t'){//the option of the highchart in the case we want a temperature
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
    else{//the option of the highchart in the case we want humidity
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

const fdata = forecastdata['data'];//data about the weather in different city
function createlistcities(){
    var mark = [];//this table will be used to create marker on the map
    for (var i in data) {//this loop is done to create a list of marks containing data from cities.json to create the marker on the map
        var des = data[i].description;
        var lon = data[i].longitude;
        var la = data[i].latitude;
        var idd = data[i].id;//id of the area
        var spec_data = fdata[i];
        var gbweather = spec_data['params']['ww']['202105171200']['code'];//this variable contain the code of the weather of the 2021 17 may 12h
        mark.push({id: idd, name: des, coordinates: [lon,la], gbw: gbweather });
    }
    return(mark)
}
const markers = createlistcities();

function address(i){ //function to add area_id in url
    return('?area_id='+i)
}
class MapChart extends  React.Component {
    constructor(props) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        var id = 0;
        var city = "";
        if(urlParams.get('area_id')){//verify if there is a variable in the url
            id=urlParams.get('area_id');
            city=data[id].description;
        }
        super(props);
        this.state = {
            clickedcity: city,//selected city
            clickedid: id,//id of the selected city
            clickedparam: 't',// temperature or humidity
        };
    };
  createhighchart(){//function used to create highchart
    if(this.state.clickedid){//true if a city is selected
        var spec_data = fdata[this.state.clickedid];
        var tabdata = [];
        if(this.state.clickedparam==='t'){
            for(var i in spec_data['params']['t']){
                if(i!=='description'){//only select the data
                    var celtemp = spec_data['params']['t'][i];
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
            for(var j in spec_data['params']['hu']){
                if(j!=='description'){//only select the data
                    var hutemp = spec_data['params']['hu'][j];
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
  createbuttons(){//create the two button to change the data of the highchart
    if(this.state.clickedid){
        return(
        <div>
            <button onClick={() => this.setState({clickedparam: 't'})}>Temperature</button>
            <button onClick={() => this.setState({clickedparam: 'h'})}>Humidity</button>
        </div>
        )
    }
 
  }
  createweathericon(code){//transform weather codes into icons
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
            rotate: [-84.2, -28, 0], // the parameters rotate and scale have been changed to zoom on Nepal
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
