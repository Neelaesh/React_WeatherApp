import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import axios from 'axios';

import WeatherData from './weatherData';

// CSS Styles for DropDown
const styles = theme => ({
  button: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

class DropDown extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      cityId: '',
      open: false,
      weatherInfoAvailable : false,
      cityDetails : {},
      weatherDetails : []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.formatCityDetails = this.formatCityDetails.bind(this);
    this.formatWeatherDetails = this.formatWeatherDetails.bind(this);
    this.capitalizeFirstLetter = this.capitalizeFirstLetter.bind(this);
    this.temperatureConverter = this.temperatureConverter.bind(this);
    this.weatherIcon = this.weatherIcon.bind(this);
  }
  
  // Function to handle DropDown Change
  handleChange(event) {
 
    console.log("City Selected ",event.target.value);
    this.setState({ [ event.target.name]: event.target.value,
                      weatherInfoAvailable : false });
    let weatherUrl = "http://api.openweathermap.org/data/2.5/forecast?id="+event.target.value+"&appid=d95d608e13c94a02ae7c3224435d28c0";
    axios.get(weatherUrl).then((response)=>{
      console.log("City Name ",response.data.city.name);
      console.log("Weather Details ",response.data);
      let cityInfo =  this.formatCityDetails(response.data);
      let weatherInfo =  this.formatWeatherDetails(response.data);
      this.setState({
          cityDetails : cityInfo,
          weatherDetails : weatherInfo,
          weatherInfoAvailable : true 
      },
          function (){
              console.log("State Info ",this.state);
          }
      );
    }).catch((error)=>{
      console.log("Weather Details not Found ",error);
      this.setState({
        weatherInfoAvailable : false
      })
      throw error;
    });    
  };

  // Function to Close DropDown
  handleClose(){
    this.setState({ open: false });
  };

  // Function to Open DropDown
  handleOpen(){
    this.setState({ open: true });
  };

  // Function to Format City Details
  formatCityDetails(weatherDetails){
    let formattedCityDetails = {};
    formattedCityDetails.cityName = weatherDetails.city.name;
    formattedCityDetails.cityId =weatherDetails.city.id;
    formattedCityDetails.latitude =weatherDetails.city.coord.lat;
    formattedCityDetails.longitude =weatherDetails.city.coord.lon;
    console.log("formattedCityDetails ",formattedCityDetails);
    return formattedCityDetails;
  }

  // Function to Format Weather Details
  formatWeatherDetails(weatherDetails){
    let formattedWeatherDetails = [];
    weatherDetails.list.map(w => {
      let date = new Date(w.dt_txt);
      let hours = date.getHours();
      let mins = date.getMinutes();
      let secs = date.getSeconds();
      let time = hours + ":" + mins + ":" + secs;
      //console.log("Time ",time);
      if(time == "9:0:0"){
        let d = new Date(w.dt*1000);
        let finalDate = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
        //console.log("Date ",finalDate);
        let weather = {};
        weather.finalDate = finalDate;
        weather.time = time + ' AM';
        weather.description = this.capitalizeFirstLetter(w.weather[0].description);
        weather.icon = this.weatherIcon(w.weather[0].icon);
        weather.windSpeed = w.wind.speed + ' meter/sec';
        weather.humidity = w.main.humidity + '%';
        weather.temprature = this.temperatureConverter(w.main.temp);
        weather.pressure = w.main.pressure + ' hpa';
        formattedWeatherDetails.push(weather);
      }
    });
    console.log("formattedWeatherDetails ",formattedWeatherDetails);
    return formattedWeatherDetails;
  }

  // Function to Capitalize First Letter of Word
  capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Function to Convert Temprature to Celsius
  temperatureConverter(valNum) {
      valNum = parseFloat(valNum);
      return Math.round((valNum-273.15)*100)/100;
      //return $('#temp').unbind().append((Math.round((valNum-273.15)*100)/100) + '&#8451;');
  }

  // Function to Display Weather Icon
  weatherIcon(icon){
    let iconUrl = "http://openweathermap.org/img/w/"+ icon +".png";
    return iconUrl;
  }

  render() {
    const { classes } = this.props;
    const cities = [
      {
        "city" : "Bangalore",
        "cityId" : "1277333"
      },
      { 
        "city" : "Chennai",
        "cityId" : "1264527"
      },
      { 
        "city" : "Hyderabad",
        "cityId" : "1269843"
      },
      { 
        "city" : "Mumbai",
        "cityId" : "1275339"
      },
      {
        "city" : "New York",
        "cityId" : "5128638"
      },
      {
        "city" : "London",
        "cityId" : "4119617"
      }
    ];
    return (
          <div>
          <form autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="demo-controlled-open-select">City</InputLabel>
              <Select
                open={this.state.open}
                onClose={this.handleClose}
                onOpen={this.handleOpen}
                value={this.state.cityId}
                onChange={this.handleChange}
                inputProps={{
                  name: 'cityId',
                  id: 'demo-controlled-open-select',
                }}
              >
              {cities.map((c, index) =>
                <MenuItem key={index} value={c.cityId}>{c.city}</MenuItem>
              )}
              </Select>
            </FormControl>
          </form>
          {this.state.weatherInfoAvailable && 
          <WeatherData weatherInformation={this.state}></WeatherData>
          }
          <center><h2>
          {
            !this.state.weatherInfoAvailable && "WeatherInfo Not Available"
          }
          </h2></center>
          </div>
    );
  }

}

DropDown.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DropDown);