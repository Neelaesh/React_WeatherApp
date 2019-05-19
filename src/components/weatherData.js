import React from 'react';

export default class WeatherData extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            cityDetails : {},
            weatherDetails: []
        }
    }

    componentDidMount(){
        console.log("Inside WeatherData ComponentDidMount ",this.props.weatherInformation);
        this.setState({
            cityDetails: this.props.weatherInformation.cityDetails,
            weatherDetails: this.props.weatherInformation.weatherDetails
        }, 
            function() {
                console.log("WeatherData State Info ",this.state);
            }
        );
    }
    
    render(){
        return(
            <div className="container">
                <center><h2>5 Days Weather Forecast</h2></center>
                <h4>City : {this.state.cityDetails.cityName}</h4>
                <h4>Latitude : {this.state.cityDetails.latitude}</h4>
                <h4>Longitude : {this.state.cityDetails.longitude}</h4>
                <table className="table">
                    <thead className="thead-dark">
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Description</th>
                        <th>Weather</th>
                        <th>Temprature</th>
                        <th>Humidity</th>
                        <th>Wind Speed</th>
                        <th>Pressure</th>
                    </tr>
                    </thead>
                    <tbody>{this.state.weatherDetails.map((item, key)=>{
                        return(
                            <tr key={key}>
                                <td>{item.finalDate}</td>
                                <td>{item.time}</td>
                                <td>{item.description}</td>
                                <td><img src={item.icon}></img></td>
                                <td>{item.temprature + '\u00b0' + 'C'}</td>
                                <td>{item.humidity}</td>
                                <td>{item.windSpeed}</td>
                                <td>{item.pressure}</td>
                            </tr>
                        )   
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
    
}