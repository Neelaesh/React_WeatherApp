import React from 'react';
import axios from 'axios';
import NavBar from './navbar';
import DropDown from './dropDown';

export default class Home extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            weatherDetails: []
        };
    }

    componentDidMount(){
        console.log("Home ComponentDidMount");
    }

    render(){
        return(
            <div>
                <NavBar></NavBar>
                <DropDown></DropDown>
            </div>
        );
    }

}